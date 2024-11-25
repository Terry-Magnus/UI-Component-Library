import { SvgIconProps } from "@mui/material";

export interface TIconProps extends SvgIconProps {
  alternate?: boolean;
  customcolor?: string;
}
// alternate is just a switch that helps change the icon. In the case of the project,
//the icons were two-toned. Look through the examples you'll see what i'm referring to....
