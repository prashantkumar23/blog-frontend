import { Button } from "@mui/material";
import { gql } from "graphql-request";
import React from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
// import imageCompression from "browser-image-compression";
import { useMutation } from "react-query";
import { client } from "../pages";

const uploadFunc = async (picString: string) => {
  const data = client.request(
    gql`
      mutation ImageUploadMutation(
        $imageUploadImageUploadInput: ImageUploadInput!
      ) {
        imageUpload(imageUploadInput: $imageUploadImageUploadInput) {
          status
          message
          url
        }
      }
    `,
    {
      imageUploadImageUploadInput: {
        photo: picString,
        username: "drew",
      },
    }
  );
  return data;
};

interface UploadFileProps {
  setBlogData(data: any): void;
}

export const UploadFile: React.FC<UploadFileProps> = ({ setBlogData }) => {
  const [images, setImages] = React.useState([]);

  const uploadMutation = useMutation((picString: string) =>
    uploadFunc(picString)
  );

  // async function compressImage(picString: File) {
  //   try {
  //     const f = await imageCompression.getFilefromDataUrl(picString, "1");
  //     const compressedFile = await imageCompression.getDataUrlFromFile(
  //       picString
  //     );
  //     return compressedFile;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  if (uploadMutation.isSuccess) {
    const imageUrl: string = uploadMutation.data.imageUpload.url;
    setBlogData((prevState: any) => {
      return {
        ...prevState,
        blogImageUrl: imageUrl,
      };
    });
    console.log(imageUrl);
  }

  const onChange = (
    imageList: ImageListType
    // addUpdateIndex: number[] | undefined
  ) => {
    setImages(imageList as never[]);
    if (imageList.length > 0 && imageList[0].dataURL) {
      uploadMutation.mutate(imageList[0].dataURL);
      // compressImage(imageList[0].file!).then((picString) => {

      // });
    }
  };

  return (
    <div className="App">
      <ImageUploading value={images} onChange={onChange}>
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <div>
            <Button
              style={isDragging ? { color: "red" } : undefined}
              onClick={onImageUpload}
              {...dragProps}
            >
              Add a cover image
            </Button>
            &nbsp;
            {images.length === 0 ? null : (
              <Button onClick={onImageRemoveAll}>Remove this image</Button>
            )}
            {imageList.map((image, index) => (
              <div key={index} className="image-item">
                <img src={image.dataURL!} alt="" width="100%" />
                <div className="image-item__btn-wrapper">
                  <Button onClick={() => onImageUpdate(index)}>Update</Button>
                  <Button onClick={() => onImageRemove(index)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
    </div>
  );
};
