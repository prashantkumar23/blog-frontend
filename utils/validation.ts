import { CreateBlogInput } from "../types";

export const validateCreateBlogInputs = async ({ title, tags, body, blogImageUrl }: CreateBlogInput): Promise<boolean> => {
    if (title.length <= 10 && tags.length > 0 && !body.length && !blogImageUrl) return false;

    return true
}