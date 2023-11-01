import { global } from '@storybook/global';

import { ClientApi, PreviewWeb, addons, composeConfigs } from '@storybook/preview-api';
import { createBrowserChannel } from '@storybook/channels';

const getProjectAnnotations = () =>
    composeConfigs([require('D:\\storyshots\\node_modules\\@storybook\\react\\preview.js'), require('D:\\storyshots\\node_modules\\@storybook\\addon-links\\dist\\preview.mjs'), require('D:\\storyshots\\node_modules\\@storybook\\addon-essentials\\dist\\docs\\preview.mjs'), require('D:\\storyshots\\node_modules\\@storybook\\addon-essentials\\dist\\actions\\preview.mjs'), require('D:\\storyshots\\node_modules\\@storybook\\addon-essentials\\dist\\backgrounds\\preview.mjs'), require('D:\\storyshots\\node_modules\\@storybook\\addon-essentials\\dist\\measure\\preview.mjs'), require('D:\\storyshots\\node_modules\\@storybook\\addon-essentials\\dist\\outline\\preview.mjs'), require('D:\\storyshots\\node_modules\\@storybook\\addon-essentials\\dist\\highlight\\preview.mjs'), require('D:\\storyshots\\node_modules\\@storybook\\addon-interactions\\dist\\preview.mjs'), require('D:\\storyshots\\.storybook\\preview.ts'),]);

const channel = createBrowserChannel({page: 'preview'});
addons.setChannel(channel);

if (global.CONFIG_TYPE === 'DEVELOPMENT') {
    window.__STORYBOOK_SERVER_CHANNEL__ = channel;
}

const preview = new PreviewWeb();

window.__STORYBOOK_PREVIEW__ = preview;
window.__STORYBOOK_STORY_STORE__ = preview.storyStore;
window.__STORYBOOK_ADDONS_CHANNEL__ = channel;
window.__STORYBOOK_CLIENT_API__ = new ClientApi({storyStore: preview.storyStore});

preview.initialize({importFn, getProjectAnnotations});

if (import.meta.webpackHot) {
    import.meta.webpackHot.accept('./storybook-stories.js', () => {
        // importFn has changed so we need to patch the new one in
        preview.onStoriesChanged({importFn});
    });

    import.meta.webpackHot.accept(['D:\\storyshots\\node_modules\\@storybook\\react\\preview.js', 'D:\\storyshots\\node_modules\\@storybook\\addon-links\\dist\\preview.mjs', 'D:\\storyshots\\node_modules\\@storybook\\addon-essentials\\dist\\docs\\preview.mjs', 'D:\\storyshots\\node_modules\\@storybook\\addon-essentials\\dist\\actions\\preview.mjs', 'D:\\storyshots\\node_modules\\@storybook\\addon-essentials\\dist\\backgrounds\\preview.mjs', 'D:\\storyshots\\node_modules\\@storybook\\addon-essentials\\dist\\measure\\preview.mjs', 'D:\\storyshots\\node_modules\\@storybook\\addon-essentials\\dist\\outline\\preview.mjs', 'D:\\storyshots\\node_modules\\@storybook\\addon-essentials\\dist\\highlight\\preview.mjs', 'D:\\storyshots\\node_modules\\@storybook\\addon-interactions\\dist\\preview.mjs', 'D:\\storyshots\\.storybook\\preview.ts',], () => {
        // getProjectAnnotations has changed so we need to patch the new one in
        preview.onGetProjectAnnotationsChanged({getProjectAnnotations});
    });
}


const pipeline = (x) => x();

const importers = [
    async (path) => {
        if (!/^\.[\\/](?:stories(?:[\\/](?!\.)(?:(?:(?!(?:^|[\\/])\.).)*?)[\\/]|[\\/]|$)(?!\.)(?=.)[^\\/]*?\.stories\.(js|jsx|mjs|ts|tsx))$/.exec(path)) {
            return;
        }

        const pathRemainder = path.substring(10);
        return import(
            /* webpackChunkName: "[request]" */
            /* webpackInclude: /(?:[\\/]stories(?:[\\/](?!\.)(?:(?:(?!(?:^|[\\/])\.).)*?)[\\/]|[\\/]|$)(?!\.)(?=.)[^\\/]*?\.stories\.(js|jsx|mjs|ts|tsx))$/ */
        './stories/' + pathRemainder
            );
    }

];

async function importFn(path) {
    for (let i = 0; i < importers.length; i++) {
        const moduleExports = await pipeline(() => importers[i](path));
        if (moduleExports) {
            return moduleExports;
        }
    }
}
