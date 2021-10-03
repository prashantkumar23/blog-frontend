import { CreateBlogInput } from "../types";

export const validateCreateBlogInputs = ({ title, tags, body, blogImageUrl }: CreateBlogInput): boolean => {
    if (title.length <= 10 && tags.length > 0 && !body.length && !blogImageUrl) return false;

    return true
}