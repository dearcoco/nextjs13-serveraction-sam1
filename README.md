### post crud sample

- https://www.youtube.com/watch?v=RZpQ4MAHf1Y
- 위 동영상 강좌를 보고 typescript로 만든 샘플이다. 동영상 소스와 일부 다를 수 있다.
- 추가 설치한 프레임웤 zustand, mongoose
- 샘플 이미지사이트 https://www.pexels.com/ko-kr/ 
- mongoDB 사이트 https://www.mongodb.com/ko-kr

1. mongoose를 설치하고 .env 파일에 mongo db용 connection string을 입력한다.

```
MONGODB_URI=xxx
```

2. database 연결 함수를 만든다.

```
import mongoose from "mongoose"
const connectDB = async () => {
    if(mongoose.connections[0].readyState) {
        return true;
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('mongo db connected');
        return true;
    }
    catch (error) {
        console.log(error);
    }
}
export default connectDB;
```

4. post 모델을 만든다.

```
import { Model, Schema, model, models } from "mongoose";

export interface IPost {
    id: string;
    title: string;
    image: string;
    createdAt: string;
    updatedAt: string;
}

interface IPostModel extends Model<IPost> {}

const postSchema = new Schema<IPost, IPostModel>({
    title: { type: String, required: true },
    image: { type: String, required: true },
    
}, {timestamps: true});

const Post = models.Post || model<IPost, IPostModel>('Post', postSchema);
export default Post;
```

5. Form 과 Button wrapper 를 만든다. 
Form wrapper 을 만든 이유는 서버 액션 실행 완료 후 input 내용들을 reset 시키기 위한 코드를 넣기 위함이다.
Button wrapper 을 만든 이유는 서버 액션 실행 시간 동안 버튼 상태를 disable 시키기 위함이다.

6. post 생성을 한다.
PostForm 컴포넌트를 만든다. 직접 실행해보고 데이터가 생성되었는지 확인한다.

```
export default async function PostPage() {
    return (
        <div>
            <h1 style={{color: 'red'}}>Post CRUD</h1>
            <PostForm />
        </div>
    );
}
```

7. PostList 컴포넌트를 만든다. PostList 는 PostCard 들로 구성된다.
PostCard는 edit 와 delete 버튼을 갖는다.

```
export default async function PostPage() {
    const {items} = await getAllPosts();
    return (
        <div>
            <h1 style={{color: 'red'}}>Post CRUD</h1>
            <PostForm />
            {items && <PostList posts={items} />}
        </div>
    );
}
```

8. PostCard는 edit 와 delete 기능을 구현한다.
delete 기능은 서버액션으로 쉽게 구현이 가능하다.
edit 기능은 조금 복잡한데 일단 UI는 post를 생성하던 PostForm 컴포넌트를 공유해서 사용하기로 하고,
PostCard에서 props로 받은 post 객체를 PostForm으로 전달하기 위해서 zustand로 useEditPostStore를 만든다.


10. search, sort, pagination 기능을 차례로 구현한다. 이 컴포넌트들의 특징은 router의 push()를 사용하는데, searchParams를 편리하게 관리하기 위해서 useCustomRouter를 만든다. 이제 Feature 컴포넌트와 Pagination 컴포넌트를 구현한다.

```
export default async function PostPage({params, searchParams}:{
    params: any,
    searchParams: PostQuery
}) {
    const {items, totalPage} = await getAllPosts(searchParams);
    return (
        <div>
            <h1 style={{color: 'red'}}>Post CRUD</h1>
            <PostForm />
            <Feature />
            {items && <PostList posts={items} />}
            {totalPage && <Pagination totalPage={totalPage} />}
        </div>
    );
}
```
