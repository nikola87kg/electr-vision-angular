COMMAND NEEDED FOR DEV SOMETIMES
set NODE_OPTIONS=--openssl-legacy-provider

DEPLOY STEPS FRONTEND
1. ANGULAR - npm run prod
2. WIN SCP - transfer files (DIST/electro-vision -> electrovision/angular)

DEPLOY STEPS BACKEND
1. WIN SCP - transfer files (electrovision-backend/express -> electrovision/express)
2. PUTTY - MVPS load - Login as: root / 4rfj KZC qgg hHzt
3. CONSOLE 
    - cd electrovision
    - forever list
    - forever stop 0
    - sudo   forever   start   --minUptime 1000   --spinSleepTime 1000   server.js 
