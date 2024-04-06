import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';

const path = require('path');
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [uni()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    css: {
        postcss: {
            plugins: [
                // postcsspxtoviewport({
                //     viewportWidth: 750,
                //     viewportHeight: 1334,
                //     unitPrecision: 3,
                //     viewportUnit: 'vw',
                //     selectorBlackList: ['ignore', 'uni'],
                //     minPixelValue: 1,
                //     mediaQuery: false
                // })
            ]
        }
    }
});
