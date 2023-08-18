import { faker } from '@faker-js/faker';

export const info = {
  blogs: '/blogs/',
  posts: '/posts/',
  ban: '/ban/',
  publish: '/publish',
  comments: '/comments/',
  testingDelete: '/testing/all-data',
  test: { user: '/testing/user/' },
  pairs: {
    connection: '/pair-game-quiz/pairs/connection',
    myCurrent: '/pair-game-quiz/pairs/my-current',
    answer: '/pair-game-quiz/pairs/my-current/answers',
    pairs: '/pair-game-quiz/pairs/',
  },
  like: '/like-status/',
  auth: {
    resendingConfirmation: '/auth/registration-email-resending',
    registration: '/auth/registration',
    login: '/auth/login',
    logout: '/auth/logout',
    registrationConfirmation: '/auth/registration-confirmation',
    passwordRecovery: '/auth/password-recovery',
    newPassword: '/auth/new-password',
    me: '/auth/me',
  },
  blogger: {
    blogs: '/blogger/blogs/',
    users: '/blogger/users/',
    usersBlog: '/blogger/users/blog/',
    comments: '/blogger/blogs/comments',
    wallpaper: '/images/wallpaper',
  },
  sa: {
    saLogin: 'admin',
    saPassword: 'qwerty',
    users: '/sa/users',
    questions: '/sa/quiz/questions/',
  },
};

//BLOG
export function createBlogInput() {
  return {
    name: faker.word.noun(6),
    description: faker.lorem.sentence(6),
    websiteUrl: faker.internet.url(),
  };
}

//POST
export function createPostInput() {
  return {
    title: faker.word.noun(6),
    shortDescription: faker.lorem.sentence(5),
    content: faker.lorem.sentences(5),
  };
}

//USERS

export function createUserInput() {
  return {
    login: faker.word.noun(6),
    password: faker.word.noun(8),
    email: faker.internet.email(),
  };
}

//COMMENTS

export function createCommentInput() {
  return {
    content: faker.lorem.sentences(4),
  };
}

//QUESTIONS

export function createQuestionInput() {
  return {
    body: faker.lorem.sentences(4),
    correctAnswers: faker.datatype.array(4),
  };
}
export function createPublishedQuestionInput() {
  return {
    published: faker.datatype.boolean(),
  };
}
