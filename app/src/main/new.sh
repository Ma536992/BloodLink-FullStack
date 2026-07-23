# 1. Add your identity (if you haven't yet)
git config --global user.email "your-email@example.com"
git config --global user.name "M Surya Mahesh"

# 2. Initialize and Stage all files
git init
git add .

# 3. Create the save point
git commit -m "Final Submission: BloodLink Full-Stack with Appium E2E Tests"

# 4. Push to your GitHub Repository
# Replace YOUR_URL with the one from your GitHub page
git remote add origin https://github.com/YOUR_USERNAME/BloodLink-FullStack.git
git branch -M main
git push -u origin main