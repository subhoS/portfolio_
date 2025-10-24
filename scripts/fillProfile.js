#!/usr/bin/env node
/*
  Simple CLI to fill data/profile.json.
  Usage: node scripts/fillProfile.js
  This script updates data/profile.json in-place. It does not install dependencies.
*/
const fs = require("fs");
const path = require("path");
const readline = require("readline");

const filePath = path.join(__dirname, "../data/profile.json");

function prompt(q) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((res) =>
    rl.question(q, (ans) => {
      rl.close();
      res(ans);
    })
  );
}

async function main() {
  if (!fs.existsSync(filePath)) {
    console.error(
      "data/profile.json not found. Run this script from project root."
    );
    process.exit(1);
  }
  const raw = fs.readFileSync(filePath, "utf8");
  const profile = JSON.parse(raw);

  console.log(
    "Fill profile values. Press enter to keep current value in [brackets].\n"
  );

  profile.name =
    (await prompt(`Full name [${profile.name}]: `)) || profile.name;
  profile.displayName =
    (await prompt(`Display name [${profile.displayName}]: `)) ||
    profile.displayName;
  profile.title =
    (await prompt(`Title/headline [${profile.title}]: `)) || profile.title;
  profile.shortBio =
    (await prompt(`Short bio [${profile.shortBio}]: `)) || profile.shortBio;
  profile.avatar =
    (await prompt(`Avatar path [${profile.avatar}]: `)) || profile.avatar;
  profile.logo =
    (await prompt(`Logo path [${profile.logo}]: `)) || profile.logo;
  profile.resume =
    (await prompt(`Resume path [${profile.resume}]: `)) || profile.resume;

  // Contact
  profile.contact = profile.contact || {};
  profile.contact.email =
    (await prompt(`Contact email [${profile.contact.email || ""}]: `)) ||
    profile.contact.email;
  profile.contact.phone =
    (await prompt(`Contact phone [${profile.contact.phone || ""}]: `)) ||
    profile.contact.phone;

  // Site
  profile.site = profile.site || {};
  profile.site.url =
    (await prompt(`Site URL [${profile.site.url}]: `)) || profile.site.url;
  profile.site.name =
    (await prompt(`Site name [${profile.site.name}]: `)) || profile.site.name;
  profile.site.description =
    (await prompt(`Site description [${profile.site.description}]: `)) ||
    profile.site.description;
  profile.site.ogImage =
    (await prompt(`OG image path [${profile.site.ogImage}]: `)) ||
    profile.site.ogImage;
  profile.site.twitter =
    (await prompt(`Twitter handle [${profile.site.twitter}]: `)) ||
    profile.site.twitter;

  // Socials
  profile.socials = profile.socials || {};
  profile.socials.github =
    (await prompt(`GitHub URL [${profile.socials.github}]: `)) ||
    profile.socials.github;
  profile.socials.linkedin =
    (await prompt(`LinkedIn URL [${profile.socials.linkedin}]: `)) ||
    profile.socials.linkedin;
  profile.socials.x =
    (await prompt(`X/Twitter URL [${profile.socials.x}]: `)) ||
    profile.socials.x;

  // Projects (simple replace)
  const keepProjects =
    (await prompt(`Keep existing featured projects? (Y/n) [Y]: `)) || "Y";
  if (!/^(y|Y|\s*)$/.test(keepProjects)) {
    const projectCount =
      parseInt(
        await prompt(
          `How many featured projects to add? [${profile.projects.length}]: `
        )
      ) || profile.projects.length;
    const projects = [];
    for (let i = 0; i < projectCount; i++) {
      console.log(`\nProject #${i + 1}`);
      const title = await prompt(`  Title: `);
      const desc = await prompt(`  Description: `);
      const tech = await prompt(`  Technologies (comma-separated): `);
      const href = await prompt(`  Link (href): `);
      projects.push({
        title,
        description: desc,
        tech: tech
          ? tech
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        href,
      });
    }
    profile.projects = projects;
  }

  fs.writeFileSync(filePath, JSON.stringify(profile, null, 2), "utf8");
  console.log(`\nWrote ${filePath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
