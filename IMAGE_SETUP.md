# Media Setup Guide

The project has been initialized with placeholder files. To ensure the site looks its best, you need to provide your own images and videos.

## ✅ CRITICAL FIX: "84 bytes" / Broken Images

We have updated `.gitattributes` to forcefully disable Git LFS. 

**IF YOUR IMAGES ARE STILL BROKEN:**
Git may be "remembering" the broken version of your files. The easiest fix is to **rename** your files before uploading them.

1.  **Rename** your local file (e.g., change `hero-portrait.jpg` to `hero-main.jpg`).
2.  **Upload** this new file to `public/images/`.
3.  **Update** the reference in the Admin Panel or `constants.ts` to use the new name.

By renaming the file, you force Git to treat it as a new entry, and our new strict settings will ensure it uploads correctly as a full image.

---

## 1. Push & Clone
1. **Push** this code to your GitHub repository.
2. **Clone/Pull** the repository to your local computer.

## 2. Add Images
Navigate to the `public/images/` folder and overwrite the files.

### Hero Image
- `public/images/hero-portrait.jpg` (Or `hero-main.jpg` if renaming)

### Project Images
- `public/images/projects/project1.jpg`
- `public/images/projects/project2.jpg`
- `public/images/projects/project3.jpg`
- `public/images/projects/project4.jpg`
- `public/images/projects/project5.jpg`
- `public/images/projects/project6.jpg`

### Testimonials
- `public/images/testimonials/sarah.jpg`
- `public/images/testimonials/marcus.jpg`

## 3. Add Resume
Add your PDF resume to the root of the public folder:
- `public/derek_lane_resume.pdf`

## 4. Add Project Videos
Create folder: `public/videos/projects/`

Add files:
- `public/videos/projects/project1.mp4`
- `public/videos/projects/project2.mp4`
...etc