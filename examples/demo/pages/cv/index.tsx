import { Modal, Select } from 'antd';
import React, { useState } from 'react';

export const CV: React.FC = () => {
  const [value, setValue] = useState([0, 1, 2]);

  return (
    <Modal open width={2000}>
      <Select
        style={{ width: '100%' }}
        mode="tags"
        value={value}
        onChange={(value) => setValue(value)}
        options={[
          { value: 0, label: 'label 0' },
          { value: 1, label: 'label 1' },
          { value: 2, label: 'label 2' },
        ]}
      />
    </Modal>
  );
};
