import { Card, CardContent, Typography, Box } from "@mui/material";
import { StatsProps } from "./types";

const StatsCard = ({ icon, name, value }: StatsProps) => {
  return (
    <Card
      sx={{
        padding: 2,
        gap: 2,
        background: "none",
        border: "1px solid #FFFFFF",
        width: "25%",
        backdropFilter: "blur(27.2px)",
        boxShadow: "0px 12px 16px -4px #0C1A240A",
      }}
    >
      <Box
        sx={{
          fontSize: "2rem",
          color: "primary.main",
          bgcolor: "#fff",
          borderRadius: "17px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "none",
          width: "48px",
          height: "48px",
          padding: "14px",
          mb: "16px",
        }}
      >
        {icon}
      </Box>
      <CardContent sx={{ padding: 0 }}>
        <Typography variant="subtitle1" color="64748B">
          {name}
        </Typography>
        <Typography fontSize="30px" fontWeight="bold">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
