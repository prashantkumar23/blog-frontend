export const DefaultElement = (props: any) => {
  return <p {...props.attributes}>{props.children}</p>;
};
