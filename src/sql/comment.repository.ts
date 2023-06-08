// import { Repository } from 'typeorm';

// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';

// @Injectable()
// export class CommentRepository {
//   constructor(
//     @InjectRepository(Comment)
//     private readonly commentRepository: Repository<Comment>,
//   ) {}
//   async findById(id: string) {
//     try {
//       return await this.CommentModel.findById(id);
//     } catch (error) {
//       return null;
//     }
//   }

//   async findCountComments(filter: { name: { $regex: string } } | object) {
//     return await this.CommentModel.countDocuments(filter);
//   }
//   async getCommentsByPostId(a: {
//     find: { name: { $regex: string } } | object;
//     sort: any;
//     skip: number;
//     limit: number;
//   }) {
//     const result: Array<Comment> = await this.CommentModel.find(a.find)
//       .sort(a.sort)
//       .skip(a.skip)
//       .limit(a.limit);

//     return result;
//   }

//   async save(comment: Comment) {
//     const commentModel = new this.CommentModel(comment);
//     return commentModel.save();
//   }

//   async updateComment(commentId: string, content: string) {
//     try {
//       const result = await this.CommentModel.findById(commentId);

//       if (!result) return false;
//       result.content = content;
//       result.save();

//       return true;
//     } catch (error) {
//       return false;
//     }
//   }

//   async deleteComment(commentId: string) {
//     try {
//       await this.CommentModel.findByIdAndDelete(commentId);
//       return true;
//     } catch (error) {
//       return false;
//     }
//   }

//   async banCommentByUserId(userId: string, isBanned: boolean) {
//     try {
//       await this.CommentModel.updateMany(
//         { 'commentatorInfo.userId': userId },
//         { $set: { isBaned: isBanned } },
//       );
//       await this.CommentModel.updateMany(
//         {},
//         { $set: { 'likesInfo.$[elem].isBaned': isBanned } },
//         { arrayFilters: [{ 'elem.userId': userId }] },
//       );
//       return true;
//     } catch (error) {
//       return null;
//     }
//   }
// }
