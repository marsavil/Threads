'use server'

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import { connectToDB } from "../mongoose"
import User from "../models/user.model";

interface Params {
  text: string;
  author: string;
  communityId: string; 
  path: string;
}
export async function createThread ({ text, author, communityId, path }: Params){
  
  try {
    connectToDB();
    //const authorID = author.toJSON();
    const newThread = await Thread.create({
      text, 
      author,
      community: null,
    });
    //update user
    const user = await User.findByIdAndUpdate(author, {
      $push: { threads: newThread._id }
    })
    revalidatePath(path)
  } catch (error: any) {
    throw new Error(`Failed to create a new thread: ${error.message}`)
  }
}
export async function fetchPosts (pageNumber = 1, pageSize = 20){ // fetch posts and implements pagination
  try {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;
    // fetch the posts that have no parents (top-level threads)
    const postQuery = Thread.find({ parentId: { $in: [null, undefined]}})
      .sort({ createdAt: 'desc' })
      .skip( skipAmount )
      .limit(pageSize)
      .populate ({ path: 'author', model: User })
      .populate ({
        path: 'children',
        populate: {
          path: 'author',
          model: User, select: '_id name parentId image'
        }
      })
      const totalPostsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined]}})
      const posts = await postQuery.exec();
      const isNext = totalPostsCount > skipAmount + posts.length;

      return {
        posts,
        isNext
      }

  } catch (error) {
    
  }
}
export async function fetchThreadById(id: string){
  try {
    connectToDB()
    const thread = await Thread.findById(id)
    //TODO : poulate community
      .populate( {
        path: 'author',
        model: User,
        select: '_id id name image'
      } )
      .populate( {
        path: 'children',
        populate: [
          {
            path: 'author',
            model: User,
            select: '_id id name image'
          },
          {
            path: 'children',
            model: Thread,
            populate: {
              path: 'author',
              model: User,
              select: '_id id name image'
            }
          }
        ]
      })
      .exec();
      return thread
  } catch (error: any) {
    throw new Error(`Failed to fetch the thread: ${error.message}`)
  }
}
export async function addComment(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  try {
    connectToDB();
    // find the original thread
    const originalThread = await Thread.findById(threadId);
    if( !originalThread ){
      throw new Error( 'Thread not found')
    }
    // create the new comment
    const newComment = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId
    })
    // save the comment
    const savedComment = await newComment.save()
    // find the user that adds the new comment
    const user = await User.findById(userId);
  
    //update original thread and the author
    originalThread.children.push(savedComment._id);
    await originalThread.save();
    user.threads.push(newComment._id);
    await user.save()

  } catch (error: any) {
    throw new Error(`Failed to add comment: ${error.message}`)
  }
}
