import { Box, Typography, Paper, Stack, Divider } from "@mui/material";
import { palette } from "@/src/styles/colors";

export default function Metadata({ metadata }) {
  if (!metadata) return null;
  const { execution_time_ms, record_count, generated_at } = metadata;

  return (
    <Box sx={{ p: 3 }}>
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
            Execution Time:{" "}
            <em>
              {execution_time_ms != null ? `${execution_time_ms} ms` : "—"}
            </em>
          </Typography>
          <Typography sx={{ fontSize: "0.9rem" }}>
            Records Processed: <em>{record_count ?? "—"}</em>
          </Typography>
          <Typography sx={{ fontSize: "0.9rem" }}>
            Generated At: <em>{generated_at ?? "—"}</em>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
