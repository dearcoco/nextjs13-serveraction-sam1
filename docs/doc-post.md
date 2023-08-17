next-auth를 사용하기 위해 가장 기본적이고 필요한 부분만 언급한다.

### 1. .env 파일에 반드시 두 개의 상수를 정의해야 한다.
- 암호 생성시 `openssl rand -base64 32` 를 사용하자.
- vercel 배포시 환경변수에 등록할 때 NEXTAUTH_URL은 부여받은 도메인으로 바꿔준다.
```text
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=C7N1SQkduNugm4CAH06h4XhaJEe/PvHgQNMeNHg+Fic
```

### 2. SessionProvider 정의
root layout이  서버 컴포넌트이므로 적용하기 위해서 SessionProvider를 wrapping 했다.
```
// context/provider.tsx
'use client'

import {SessionProvider} from 'next-auth/react';

const Provider = ({children}: {children: React.ReactNode}) => {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}

export default Provider;
```

```
// app/layout.tsx
export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
		<body className={inter.className}>
				<Provider>
					<Header />
					<main style={{margin: '50px'}}>{children}</main>
				</Provider>
			</body>
		</html>
	)
}
```

### 3. NextAuthOptions 

- vercel에 배포시 라우팅 에러가 발생해서 `pages/api/auth/[...nextauth].ts` 를 사용했다.
- 필수적으로 정의해야하는 요소들은 prividers, callbacks, pages, secret 이다.

아래는 Provider 정의이다.
- OAuth Provider은 id와 secret키를 입력하면 끝이다.
- CredentialProvider는 로그인 성공여부를 판단해야 하므로 그 역할을 하는 authorize 함수를 구현한다. 이 함수의 매개변수 credentials 는 바로 위에 정의한 credentials 타입의 요소를 가진 객체이다. 이것은 하나의 약속으로 로그인시 웹페이지에서 전송되는 폼요소에도 역시 email과 password가 존재해야 한다.
```
providers: [
	GoogleProvider({
		clientId: process.env.GOOGLE_ID!,
		clientSecret: process.env.GOOGLE_SECRET!,
	}),
	CredentialsProvider({
		name: "Credentials",
		credentials: {
			email: { label: "Email", type: "text", required: true },
			password: { label: "Password", type: "password", required: true },
		},
		async authorize(credentials, req) {
			...
			return user ? user : null;
		},
	}),
],
```

아래는 callback 함수들이다.
- signIn: 모든 프로바이더를 막론하고 로그인 성공시 호출된다. 어떤 경우에 필요할까? OAuth 로그인 유저 정보를 DB에 저장할 필요가 있을 경우라면 정의해야 할 것이다. 반대로 Credential 프로바이더만 사용하는 경우라면 이미 authorize 함수가 있기에 정의할 필요는 없을 것이다.
- jwt: useSession, getServerSession 가 실행될 때 호출된다. 어떤 경우에 필요할까? db에서 가져온 유저정보를 token.user 에 덮어씌우는 용도로 사용할 수 있다. 이 경우 session 함수도 반드시 정의해야 한다. 이 밖에 trigger의 값이 "update" 일 경우 세션 정보가 업데이트 된 경우에 대한 특별한 처리를 할 수도 있다.
- session: 이 함수는 jwt 함수 호출에 이어서 호출되고 jwt 함수에서 변경한 token 값이 매개변수로 넘어온다는 특징이 있다. token.user 의 값으로 session.user에 덮어씌우면 이 값이 최종적으로 useSession 과 getServerSession 에 전달되는 것이다.
```
callbacks: {
	async signIn({ user, account, profile, email, credentials }) {
		...
		return true;
	},
	async jwt({ token, trigger, session }) {
		...
		return token;
	},
	async session({ session, token }) {
		...
		return session;
	},
},
```
- jwt, session 에 대해 부연설명을 하자면 페이지들이 처음 로딩될 때는 100% 호출된다. 그러나 이미 렌더링된 페이지를 다시 로딩하면 호출되지 않는다. 일정 시간이 지난 후 다시 로딩해보면 호출된다. 그리고 브라우져에서 F5를 눌를 경우 2,3번 반복해서 호출되는 특이한 현상이 있다.

다음은 pages 이다.
- signIn: 커스텀 로그인 페이지 위치
- error: 커스텀 에러 페이지 위치

```
	pages: {
		signIn: "/signin",
		error: "/errors"
	},
```

secret 도 필수로 정의해야 한다.
```
secret: process.env.NEXTAUTH_SECRET,
```


### 4. 세션 데이터 수정의 즉각 반영

세션 관련 정보를 수정했을 경우 그 결과가 즉시 반영되지 않는 경우가 있다. next/router를 사용하게 되면 새로 고침 없이 페이지 전환을 하므로 session이 업데이트 되지 않기 때문이다. 
이 때 쉬운 해결책이 있는데 useSession 훅에서 반환하는 update 함수를 호출하면 된다.
아래 소스를 보면 ProfileUpdate 컴포넌트에서 update 함수를 호출하고 있다. 그 결과 callbacks 에 등록된 jwt 가 호출된다.

```
const ProfileComponent = ({user}: {user: IUser}) => {
    const {data: session, update} = useSession();
 	....
    
    return (
        <div>
    		....
            <ProfileUpdate update={update} />
        </div>
    );
}
....
const ProfileUpdate = ({update}: {update: UpdateSession}) => {
    async function handleUpdateProfile(formData: FormData) {
        const name = formData.get('name')!.toString();
        const image = formData.get('image')!.toString();
        const msg = await updateUser({name, image});
        if (update) {
            await update({name, image});
        }
        alert(msg);
    }
	...
}
```

jwt 함수의 세 번째 매개변수 session 은 update 함수의 첫 번째 매개변수가 전달된 값이고, 두 번째 매개변수 trigger의 값은 'update' 가 된다.
```
...
// pages/api/auth/[...nextauth].ts
async jwt({ token, trigger, session }) {
	if (trigger === "update") {
	 	(token.user as any).name = session.name;
	 	(token.user as any).image = session.image;
	} 
	...
	return token;
},
```

### 5. 브라우저에서 F5를 눌렀을 경우

use client 의 경우 서버쪽 로그를 살펴보면 jwt가 2,3번 정도 호출되면서 계속 리렌더링을 시도하는 것 같다. 그 이유는 현재 알 수 없다. 어쨌든 첫 번째에서는 session이 undefiend로 넘어온다는 점이다. 때문에 컴포넌트 렌더링시 null 처리를 하지 않으면 에러가 발생한다.

```
const ProfileCard = ({user}: {user: IUser}) => {
    return (
        <div>
            <h2>Name: {user?.name}</h2>
            {
                user?.image &&
                <Image src={user?.image} alt='avarta' width={100} height={100} />
            }
            <h2>Email: {user?.email}</h2>
            <h4>Role: {user?.role}</h4>
            <h4>Provider: {user?.provider}</h4>
        </div>
    );
}
```

### 6. middleware 

현재 vercel에 배포하면 작동하지 않아서 사용하지 않고 있다. 원인은 알 수 없다.

```
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { IUser } from "./models/userModel";

export default withAuth(
	function middleware(req) {
        const {pathname, origin} = req.nextUrl;
        const {token} = req.nextauth;
		// 유저의 role을 검사하여 접근여부를 판단
        if (pathname.startsWith('/dashboard')) {
            if (!token || !token.user || (token.user as IUser).role !== 'admin') {
                return new NextResponse('You are not authorized.');
            }
        }
	},
	{
		callbacks: {
			authorized: ({ token }) => !!token,
		},
		secret: process.env.NEXTAUTH_SECRET
	},
);

// 등록된 페이지로 접근 시 callbackUrl이 붙은 signin 페이지로 리다이렉트
export const config = {
	matcher: ["/profile/:path*", "/protected/:path*", "/dashboard/:path*"],
};
```

