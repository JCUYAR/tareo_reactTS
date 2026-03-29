import * as FaIcons from "react-icons/fa";
import * as BsIcons from "react-icons/bs";
import * as MdIcons from "react-icons/md";

interface Props {
  name: string;
  size?: number;
  className?: string;
  CStyle?: React.CSSProperties;
}

export default function Icon({ 
  name, 
  size = 20, 
  className, 
  CStyle
}: Props) {

  const Icons = {
    ...FaIcons,
    ...BsIcons,
    ...MdIcons
  };

  const SelectedIcon = Icons[name as keyof typeof Icons];

  if (!SelectedIcon) return null;
  return <SelectedIcon size={size} className={className} style={{ ...CStyle}}  />;
}