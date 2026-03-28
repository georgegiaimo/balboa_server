# 1. Use a lightweight Node.js image
FROM node:20-slim

# 2. Install Chromium and necessary fonts for PDF rendering
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-thai-tlwg \
    fonts-kacst \
    fonts-freefont-ttf \
    libxss1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# 3. Set environment variable so Puppeteer knows where Chromium is
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# 4. Create app directory
WORKDIR /usr/src/app

# 5. Install dependencies
COPY package*.json ./
RUN npm install

# 6. Copy source code and build (if using TypeScript)
COPY . .
RUN npm run build

# 7. Expose the port Azure uses
EXPOSE 3000

# 8. Start the server
CMD [ "node", "dist/server.js" ]