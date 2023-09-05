import {
  useState,
  useEffect,
  useReducer,
  FC,
  useRef,
  Dispatch,
  SetStateAction
} from 'react';
import Tags from "@yaireo/tagify/dist/react.tagify";
import "@yaireo/tagify/dist/tagify.css";
import "../../../public/tagify.css";
import { AlloTag } from "@customTypes/tag"

interface InterfaceProps {
  limit?: number;
  onNextPage?: () => void;
  queryTags: AlloTag[];
  setQueryTags:  Dispatch<SetStateAction<AlloTag[]>>;
}


export const Interface: FC<InterfaceProps> = (props: InterfaceProps) => {
  const tagifyRef = useRef();

  const onChange = (e: any) => {
    const tags: AlloTag[] = e.detail.tagify.getCleanValue();
    console.log(tags)
    props.setQueryTags(tags);
  }

  return(
    <div className="viewerInterface">
      <Tags
        tagifyRef={tagifyRef}
        onChange={onChange}
      />
    </div>
  )
}