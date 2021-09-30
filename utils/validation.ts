import { CreateBlogInput } from "../types";

export const validateCreateBlogInputs = ({ title, tags, body, blogImageUrl }: CreateBlogInput): boolean => {
    console.log(title, tags, body, blogImageUrl)
    if (title.length <= 10) return false;
    if (tags.length < 2) return false;
    if (!body) return false;
    if (!blogImageUrl) return false;

    return true
}