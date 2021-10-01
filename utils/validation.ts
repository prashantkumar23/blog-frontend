import { CreateBlogInput } from "../types";

export const validateCreateBlogInputs = ({ title, tags, body, blogImageUrl }: CreateBlogInput): boolean => {
    if (title.length <= 10) return false;
    if (0 < tags.length && tags.length < 3) return false;
    if (!body) return false;
    if (!blogImageUrl) return false;

    return true
}