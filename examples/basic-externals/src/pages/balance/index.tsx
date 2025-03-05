import { MoneyCollectOutlined } from '@ant-design/icons';
import { Button, Flex, Spin, Statistic } from 'antd';
import React, { useEffect, useState } from 'react';
import { useExternals } from '../../externals/Context';

export const Balance = () => {
  const externals = useExternals();
  const [balance, setBalance] = useState<number>();

  useEffect(() => {
    externals.business
      .getBalanceAt(externals.environment.now().getTime())
      .then((balance) => setBalance(balance));
  }, []);

  if (balance === undefined) {
    return (
      <Flex vertical align="center" justify="center" style={{ height: '100%' }}>
        <Spin />
      </Flex>
    );
  }

  return (
    <Flex
      vertical
      align="center"
      justify="center"
      style={{ height: '100%' }}
      gap={20}
    >
      <Statistic
        title="Account Balance (RUB)q"
        value={balance}
        precision={2}
        suffix={<MoneyCollectOutlined />}
      />
      <Flex justify="center">
        <Button
          type="primary"
          onClick={() => {
            externals.analytics.log('worked hard');

            setBalance(balance + SALARY);
          }}
        >
          Work hard
        </Button>
        {balance >= SALARY && (
          <Button
            type="default"
            style={{ marginLeft: 16 }}
            onClick={() => {
              externals.analytics.log('relaxed a little');

              setBalance(balance - SALARY);
            }}
          >
            Relax
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

const SALARY = 10_000;
