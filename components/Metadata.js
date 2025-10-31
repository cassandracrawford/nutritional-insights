// import { Box, Typography, Paper, Stack } from "@mui/material";
// import { palette } from "@/src/styles/colors";

// export default function Metadata({ metadata }) {
//   if (!metadata) return null; // hide if no metadata yet

//   const { executionTime, lastUpdated, dataset, recordCount, status, source } =
//     metadata;

//   return (
//     <Box sx={{ p: 2 }}>
//       <Paper
//         elevation={2}
//         sx={{
//           p: 2,
//           bgcolor: palette.paper,
//           borderLeft: `6px solid ${palette.primary}`,
//           borderRadius: 2,
//         }}
//       >
//         <Typography
//           variant="h6"
//           sx={{ fontWeight: "bold", color: palette.primary, mb: 1 }}
//         >
//           Metadata
//         </Typography>

//         <Stack
//           spacing={0.5}
//           sx={{ color: palette.text.primary, fontSize: "0.9rem" }}
//         >
//           {executionTime && (
//             <Typography>Execution Time: {executionTime}s</Typography>
//           )}
//           {lastUpdated && (
//             <Typography>Last Updated: {lastUpdated}</Typography>
//           )}
//           {dataset && <Typography>Dataset: {dataset}</Typography>}
//           {recordCount && (
//             <Typography>Records Processed: {recordCount}</Typography>
//           )}
//           {status && <Typography>Status: {status}</Typography>}
//           {source && (
//             <Typography>
//               Source:{" "}
//               <span style={{ color: palette.primary }}>{source}</span>
//             </Typography>
//           )}
//         </Stack>
//       </Paper>
//     </Box>
//   );
// }

import { Box, Typography, Paper, Stack, Divider } from "@mui/material";
import { palette } from "@/src/styles/colors";

export default function Metadata() {
  return (
    <Box sx={{ p: 3 /* same as FiltersBar outer Box */ }}>
      <Paper
        elevation={2}
        sx={{ p: 3, bgcolor: palette.paper, borderRadius: 2 }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: palette.primary, mb: 1 }}
        >
          Metadata
        </Typography>
        <Divider sx={{ mb: 2, borderColor: palette.primary, opacity: 0.3 }} />
        <Stack spacing={0.5} sx={{ color: palette.textSecondary }}>
          <Typography sx={{ fontSize: "0.9rem" }}>
            Execution Time: <em>Loading...</em>
          </Typography>
          <Typography sx={{ fontSize: "0.9rem" }}>
            Last Updated: <em>--/--/----</em>
          </Typography>
          <Typography sx={{ fontSize: "0.9rem" }}>
            Dataset: <em>All_Diets.csv</em>
          </Typography>
          <Typography sx={{ fontSize: "0.9rem" }}>
            Records Processed: <em>--</em>
          </Typography>
          <Typography sx={{ fontSize: "0.9rem" }}>
            Status: <em>Waiting for data...</em>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
