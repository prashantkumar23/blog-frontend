export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type AddCommentInput = {
  userId: Scalars['String'];
  commentBody: Scalars['String'];
  blogId: Scalars['String'];
};

export type AddCommentResponse = {
  __typename?: 'AddCommentResponse';
  status: Scalars['Boolean'];
  comment?: Maybe<Scalars['String']>;
  message: Scalars['String'];
};

export type Blog = {
  __typename?: 'Blog';
  _id: Scalars['String'];
  title: Scalars['String'];
  body: Scalars['String'];
  blogImageUrl: Scalars['String'];
  user: UserCreated;
  tags?: Maybe<Array<Scalars['String']>>;
};

export type BlogByTag = {
  __typename?: 'BlogByTag';
  _id: Scalars['String'];
  title: Scalars['String'];
  blogImageUrl?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  tags?: Maybe<Array<Scalars['String']>>;
  user?: Maybe<UserInfoTwo>;
};

export type BlogComment = {
  __typename?: 'BlogComment';
  _id: Scalars['String'];
  comment: Scalars['String'];
  user: CommentedUserOnThatBlog;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type BlogComments = {
  __typename?: 'BlogComments';
  _id: Scalars['String'];
  comments?: Maybe<Array<BlogComment>>;
};

export type Blogs = {
  __typename?: 'Blogs';
  _id: Scalars['String'];
  title: Scalars['String'];
  blogImageUrl: Scalars['String'];
  tags: Array<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  user: UserInfo;
};

export type BlogsArray = {
  __typename?: 'BlogsArray';
  id: Scalars['String'];
  title: Scalars['String'];
  blogImageUrl?: Maybe<Scalars['String']>;
  tags: Array<Scalars['String']>;
  createdAt: Scalars['DateTime'];
};

export type Comment = {
  __typename?: 'Comment';
  id: Scalars['String'];
  comment: Scalars['String'];
};

export type CommentedUserOnThatBlog = {
  __typename?: 'CommentedUserOnThatBlog';
  _id: Scalars['String'];
  name: Scalars['String'];
  image: Scalars['String'];
};

export type CreateBlogInput = {
  userId: Scalars['String'];
  title: Scalars['String'];
  body: Scalars['String'];
  blogImageUrl: Scalars['String'];
  tags: Array<Scalars['String']>;
};

export type CreateBlogResponse = {
  __typename?: 'CreateBlogResponse';
  status: Scalars['Boolean'];
  message: Scalars['String'];
};

export type DashboardResponse = {
  __typename?: 'DashboardResponse';
  status?: Maybe<Scalars['Boolean']>;
  message?: Maybe<Scalars['String']>;
};

export type DeleteCommentInput = {
  blogId: Scalars['String'];
  commentId: Scalars['String'];
};

export type DeleteCommentResponse = {
  __typename?: 'DeleteCommentResponse';
  status: Scalars['Boolean'];
  message: Scalars['String'];
};

export type GetAllTopicsResponse = {
  __typename?: 'GetAllTopicsResponse';
  topics: Array<Topic>;
  message: Scalars['String'];
};

export type GetBlogInput = {
  blogId: Scalars['String'];
};

export type GetBlogResponse = {
  __typename?: 'GetBlogResponse';
  blog?: Maybe<Blog>;
  message?: Maybe<Scalars['String']>;
};

export type GetBlogsByTagInput = {
  tag: Scalars['String'];
  pageNumber: Scalars['Float'];
  nPerPage: Scalars['Float'];
};

export type GetBlogsByTagResponse = {
  __typename?: 'GetBlogsByTagResponse';
  count: Scalars['Float'];
  next?: Maybe<NextTopicParams>;
  prevoius?: Maybe<Scalars['String']>;
  blogs?: Maybe<Array<BlogByTag>>;
  message: Scalars['String'];
};

export type GetBlogsInput = {
  pageNumber: Scalars['Float'];
  nPerPage: Scalars['Float'];
};

export type GetBlogsResponse = {
  __typename?: 'GetBlogsResponse';
  count: Scalars['Float'];
  next?: Maybe<NextBlogsParams>;
  prevoius?: Maybe<Scalars['String']>;
  blogs?: Maybe<Array<Blogs>>;
  message?: Maybe<Scalars['String']>;
};

export type GetCommentsOfBlogInput = {
  blogId: Scalars['String'];
};

export type GetCommentsOfBlogResponse = {
  __typename?: 'GetCommentsOfBlogResponse';
  count?: Maybe<Scalars['Float']>;
  next?: Maybe<NextCommentsParams>;
  prevoius?: Maybe<Scalars['String']>;
  blogComments?: Maybe<BlogComments>;
  message?: Maybe<Scalars['String']>;
};

export type GetListOfUsersResponse = {
  __typename?: 'GetListOfUsersResponse';
  users?: Maybe<Array<ListOfUsers>>;
  message: Scalars['String'];
};

export type GetTopBlogsByTopicInput = {
  topic: Scalars['String'];
};

export type GetTopBlogsByTopicResponse = {
  __typename?: 'GetTopBlogsByTopicResponse';
  blogs?: Maybe<Array<TopBlogs>>;
  message?: Maybe<Scalars['String']>;
};

export type GetTopTagsByNumberOfPostResponse = {
  __typename?: 'GetTopTagsByNumberOfPostResponse';
  tag?: Maybe<Scalars['String']>;
};

export type GetUserBlogInput = {
  userId: Scalars['String'];
  pageNumber: Scalars['Float'];
  nPerPage: Scalars['Float'];
};

export type GetUserBlogsFromOtherUsersInput = {
  name: Scalars['String'];
  pageNumber: Scalars['Float'];
  nPerPage: Scalars['Float'];
};

export type GetUserBlogsFromOtherUsersResponse = {
  __typename?: 'GetUserBlogsFromOtherUsersResponse';
  count: Scalars['Float'];
  next?: Maybe<NextUserBlogsParams2>;
  prevoius?: Maybe<Scalars['String']>;
  blogs?: Maybe<Array<UserBlogsArray>>;
  message: Scalars['String'];
};

export type GetUserBlogsResponse = {
  __typename?: 'GetUserBlogsResponse';
  count: Scalars['Float'];
  next?: Maybe<NextUserBlogsParams>;
  prevoius?: Maybe<Scalars['String']>;
  blogs?: Maybe<Array<BlogsArray>>;
  message: Scalars['String'];
};

export type GetUserInfoFromNameInput = {
  name: Scalars['String'];
};

export type GetUserInfoFromNameResponse = {
  __typename?: 'GetUserInfoFromNameResponse';
  user?: Maybe<UserInformation3>;
  message: Scalars['String'];
};

export type GetUserInfoInput = {
  userId: Scalars['String'];
};

export type GetUserInfoResponse = {
  __typename?: 'GetUserInfoResponse';
  user?: Maybe<UserInformation>;
  message: Scalars['String'];
};

export type ImageUploadInput = {
  photo: Scalars['String'];
  username: Scalars['String'];
};

export type ImageUploadResponse = {
  __typename?: 'ImageUploadResponse';
  status: Scalars['Boolean'];
  message: Scalars['String'];
  url: Scalars['String'];
};

export type ListOfUsers = {
  __typename?: 'ListOfUsers';
  id: Scalars['String'];
  name: Scalars['String'];
  image: Scalars['String'];
};

export type LoginInput = {
  username: Scalars['String'];
  password: Scalars['String'];
};

export type LoginPayload = {
  __typename?: 'LoginPayload';
  accessToken: Scalars['String'];
  refreshToken: Scalars['String'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  status: Scalars['Boolean'];
  message: Scalars['String'];
  loginPayload?: Maybe<LoginPayload>;
};

export type LogoutInput = {
  refreshToken: Scalars['String'];
};

export type LogoutResponse = {
  __typename?: 'LogoutResponse';
  status: Scalars['Boolean'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  register: RegisterResponse;
  login: LoginResponse;
  createBlog: CreateBlogResponse;
  addComment: AddCommentResponse;
  updateComment: UpdateCommentResponse;
  deleteComment: DeleteCommentResponse;
  imageUpload: ImageUploadResponse;
  updateBio?: Maybe<UpdateBioResponse>;
};


export type MutationRegisterArgs = {
  registerInput: RegisterInput;
};


export type MutationLoginArgs = {
  loginInput: LoginInput;
};


export type MutationCreateBlogArgs = {
  createBlogInput: CreateBlogInput;
};


export type MutationAddCommentArgs = {
  addCommentInput: AddCommentInput;
};


export type MutationUpdateCommentArgs = {
  updateCommentInput: UpdateCommentInput;
};


export type MutationDeleteCommentArgs = {
  updateCommentInput: DeleteCommentInput;
};


export type MutationImageUploadArgs = {
  imageUploadInput: ImageUploadInput;
};


export type MutationUpdateBioArgs = {
  updateBioInput: UpdateBioInput;
};

export type NextBlogsParams = {
  __typename?: 'NextBlogsParams';
  pageNumber: Scalars['Float'];
  nPerPage: Scalars['Float'];
};

export type NextCommentsParams = {
  __typename?: 'NextCommentsParams';
  pageNumber: Scalars['Float'];
  nPerPage: Scalars['Float'];
};

export type NextTopicParams = {
  __typename?: 'NextTopicParams';
  pageNumber: Scalars['Float'];
  nPerPage: Scalars['Float'];
};

export type NextUserBlogsParams = {
  __typename?: 'NextUserBlogsParams';
  pageNumber: Scalars['Float'];
  nPerPage: Scalars['Float'];
};

export type NextUserBlogsParams2 = {
  __typename?: 'NextUserBlogsParams2';
  pageNumber: Scalars['Float'];
  nPerPage: Scalars['Float'];
};

export type Query = {
  __typename?: 'Query';
  refreshToken: RefreshTokenResponse;
  logout: LogoutResponse;
  getBlog: GetBlogResponse;
  getBlogs: GetBlogsResponse;
  dashboard: DashboardResponse;
  getTopTagsByNumberOfPost: Array<GetTopTagsByNumberOfPostResponse>;
  getBlogsByTag: GetBlogsByTagResponse;
  getUserInfo?: Maybe<GetUserInfoResponse>;
  getUserBlogs?: Maybe<GetUserBlogsResponse>;
  search: SearchResponse;
  getCommentsOfBlog: GetCommentsOfBlogResponse;
  getAllTopics: GetAllTopicsResponse;
  getTopBlogsByTopicResolver: GetTopBlogsByTopicResponse;
  getUserBlogsFromOtherUsers?: Maybe<GetUserBlogsFromOtherUsersResponse>;
  getListOfUsers?: Maybe<GetListOfUsersResponse>;
  getUserInfoFromName?: Maybe<GetUserInfoFromNameResponse>;
};


export type QueryRefreshTokenArgs = {
  refreshTokenInput: RefreshTokenInput;
};


export type QueryLogoutArgs = {
  logoutInput: LogoutInput;
};


export type QueryGetBlogArgs = {
  blogId: GetBlogInput;
};


export type QueryGetBlogsArgs = {
  getBlogsInput: GetBlogsInput;
};


export type QueryGetBlogsByTagArgs = {
  findByTagInput: GetBlogsByTagInput;
};


export type QueryGetUserInfoArgs = {
  userId: GetUserInfoInput;
};


export type QueryGetUserBlogsArgs = {
  userId: GetUserBlogInput;
};


export type QuerySearchArgs = {
  createBlogInput: SearchInput;
};


export type QueryGetCommentsOfBlogArgs = {
  blogId: GetCommentsOfBlogInput;
};


export type QueryGetTopBlogsByTopicResolverArgs = {
  getTopBlogsByTopicInput: GetTopBlogsByTopicInput;
};


export type QueryGetUserBlogsFromOtherUsersArgs = {
  getUserBlogsFromOtherUsersInput: GetUserBlogsFromOtherUsersInput;
};


export type QueryGetUserInfoFromNameArgs = {
  name: GetUserInfoFromNameInput;
};

export type RefreshTokenInput = {
  refreshToken: Scalars['String'];
};

export type RefreshTokenPayload = {
  __typename?: 'RefreshTokenPayload';
  accessToken: Scalars['String'];
  refreshToken: Scalars['String'];
};

export type RefreshTokenResponse = {
  __typename?: 'RefreshTokenResponse';
  status: Scalars['Boolean'];
  message: Scalars['String'];
  refreshTokenPayload: RefreshTokenPayload;
};

export type RegisterInput = {
  username: Scalars['String'];
  password: Scalars['String'];
};

export type RegisterPayload = {
  __typename?: 'RegisterPayload';
  accessToken: Scalars['String'];
  refreshToken: Scalars['String'];
};

export type RegisterResponse = {
  __typename?: 'RegisterResponse';
  status: Scalars['Boolean'];
  message: Scalars['String'];
  registerPayload?: Maybe<RegisterPayload>;
};

export type SearchInput = {
  term: Scalars['String'];
};

export type SearchResponse = {
  __typename?: 'SearchResponse';
  status: Scalars['Boolean'];
  message: Scalars['String'];
  result?: Maybe<Array<SearchResult>>;
};

export type SearchResult = {
  __typename?: 'SearchResult';
  _id: Scalars['String'];
  title: Scalars['String'];
};

export type TopBlogs = {
  __typename?: 'TopBlogs';
  _id: Scalars['String'];
  title: Scalars['String'];
  blogImageUrl: Scalars['String'];
  tags: Array<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  user: UserAssociated;
};

export type Topic = {
  __typename?: 'Topic';
  topicName: Scalars['String'];
  topicDescription: Scalars['String'];
  topicColorCode: Scalars['String'];
};

export type UpdateBioInput = {
  userId: Scalars['String'];
  bio: Scalars['String'];
};

export type UpdateBioResponse = {
  __typename?: 'UpdateBioResponse';
  bio?: Maybe<Scalars['String']>;
  message: Scalars['String'];
};

export type UpdateCommentInput = {
  commentId: Scalars['String'];
  commentBody: Scalars['String'];
};

export type UpdateCommentResponse = {
  __typename?: 'UpdateCommentResponse';
  comment?: Maybe<Comment>;
  status: Scalars['Boolean'];
  message: Scalars['String'];
};

export type UserAssociated = {
  __typename?: 'UserAssociated';
  _id: Scalars['String'];
  name: Scalars['String'];
  image: Scalars['String'];
};

export type UserBlogsArray = {
  __typename?: 'UserBlogsArray';
  id: Scalars['String'];
  title: Scalars['String'];
  blogImageUrl?: Maybe<Scalars['String']>;
  tags: Array<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  user: UserInformation2;
};

export type UserCreated = {
  __typename?: 'UserCreated';
  _id: Scalars['String'];
  name: Scalars['String'];
  image: Scalars['String'];
};

export type UserInfo = {
  __typename?: 'UserInfo';
  _id: Scalars['String'];
  name: Scalars['String'];
  image: Scalars['String'];
};

export type UserInfoTwo = {
  __typename?: 'UserInfoTwo';
  _id: Scalars['String'];
  name: Scalars['String'];
  image: Scalars['String'];
};

export type UserInformation = {
  __typename?: 'UserInformation';
  id: Scalars['String'];
  bio?: Maybe<Scalars['String']>;
};

export type UserInformation2 = {
  __typename?: 'UserInformation2';
  id: Scalars['String'];
  name: Scalars['String'];
  image: Scalars['String'];
  bio: Scalars['String'];
};

export type UserInformation3 = {
  __typename?: 'UserInformation3';
  id: Scalars['String'];
  name: Scalars['String'];
  image: Scalars['String'];
  bio?: Maybe<Scalars['String']>;
};
