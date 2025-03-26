import { SelectAction } from '@core';
import { Frame } from 'playwright';
import { select } from '../../select';

export function doSelect(preview: Frame, action: SelectAction) {
  return select(preview, action.payload.on).selectOption(
    action.payload.values,
    action.payload.options,
  );
}
