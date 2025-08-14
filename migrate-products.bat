@echo off
echo 🚀 Starting Product Migration for Windows...

REM Set environment variables
set MONGODB_URI=mongodb://localhost:27017/handcrafted-haven
set NODE_ENV=development

echo 🔍 Environment variables set:
echo    MONGODB_URI=%MONGODB_URI%
echo    NODE_ENV=%NODE_ENV%

echo.
echo 📦 Running migration script...
npx tsx scripts/migrate-products.ts

pause
