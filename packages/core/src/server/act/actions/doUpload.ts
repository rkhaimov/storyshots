import { UploadFileAction } from '@core';
import path from 'path';
import { FileChooser, Frame } from 'playwright';
import { doClick } from './doClick';

export function doUploadFile(preview: Frame, upload: UploadFileAction) {
  return new Promise<void>((resolve, reject) => {
    function setFiles(chooser: FileChooser) {
      chooser
        .setFiles(
          upload.payload.paths.map((it) => path.join(process.cwd(), it)),
        )
        .then(() => resolve())
        .catch((reason) => reject(reason));
    }

    preview.page().once('filechooser', setFiles);

    void doClick(preview, {
      action: 'click',
      payload: { on: upload.payload.chooser, options: {} },
    }).catch((reason) => {
      preview.page().off('filechooser', setFiles);

      reject(reason);
    });
  });
}
