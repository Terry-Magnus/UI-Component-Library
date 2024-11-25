import { Avatar, Box, Typography } from "@mui/material";
import { PersonProps } from "./types";

const Person = ({ image, name, sub }: PersonProps) => (
  <Box display="flex" alignItems="center" gap="20px">
    <Avatar alt={name} src={image} />
    <Box>
      <Typography variant="body1" fontWeight="bold">
        {name}
      </Typography>
      {sub && <Typography variant="subtitle2">{sub}</Typography>}
    </Box>
  </Box>
);

export default Person;
