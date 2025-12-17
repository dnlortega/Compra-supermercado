@echo off
echo ========================================
echo  Regenerando Prisma Client
echo ========================================
echo.
echo Por favor, pare o servidor (Ctrl+C) antes de executar este script.
echo.
pause

echo Gerando Prisma Client...
call npx prisma generate

echo.
echo ========================================
echo  Concluido! Agora execute: npm run dev
echo ========================================
pause
