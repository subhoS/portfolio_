"use client";

import { Stack, IconButton } from "@mui/joy";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";

type Props = {
  links: { github?: string; linkedin?: string; x?: string };
};

export default function SocialLinks({ links }: Props) {
  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      {links.github && (
        <IconButton
          component="a"
          href={links.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <GitHubIcon />
        </IconButton>
      )}
      {links.linkedin && (
        <IconButton
          component="a"
          href={links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <LinkedInIcon />
        </IconButton>
      )}
      {links.x && (
        <IconButton
          component="a"
          href={links.x}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X"
        >
          <TwitterIcon />
        </IconButton>
      )}
    </Stack>
  );
}
