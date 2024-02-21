"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { usePathname, useRouter } from "next/navigation";
import { CommentValidation } from "@/lib/validations/thread";
import { addComment } from "@/lib/actions/thread.actions";
import Image from "next/image";

interface Props {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
}

const Comment = ({ threadId, currentUserImg, currentUserId }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: '',
    },
  });
  const onSubmit = async ( values: z.infer<typeof CommentValidation >) => {
    
    await addComment(threadId, values.thread, JSON.parse(currentUserId), pathname );
    form.reset();
    router.refresh();
  }
return (
  <Form {...form}>
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="comment-form"
    >
    <FormField
        control={form.control}
        name="thread"
        render={({ field }) => (
          <FormItem className="flex items-center gap-3 w-full">
            <FormLabel >
              <Image  
                src={currentUserImg}
                alt="Profile photo"
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
            </FormLabel>
            <FormControl className='border-none bg-transparent'>
              <Input
                placeholder="Comment ..."
                type='text'
                className="no-focus text-light-1 outline-none"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
    />
    <Button type="submit" className="comment-form_btn">
      Reply
    </Button>
    </form>
  </Form>
  );
};
export default Comment;
