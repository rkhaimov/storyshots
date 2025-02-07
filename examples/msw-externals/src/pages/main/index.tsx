import { Button, Col, Flex, List, Result, Row, Spin, Modal } from 'antd';
import React from 'react';
import { petsApi } from '../../externals';

export const Main = () => {
  const [modal, ch] = Modal.useModal();

  const response = petsApi.useFindPetsByStatusQuery([
    'available',
    'sold',
    'pending',
  ]);

  const [addPet, addPetStatus] = petsApi.useAddPetMutation();

  if (response.isLoading) {
    return <Spin spinning />;
  }

  if (
    response.isError &&
    'status' in response.error &&
    response.error.status === 500
  ) {
    return (
      <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
      />
    );
  }

  if (response.data === undefined) {
    return <Spin spinning />;
  }

  return (
    <Flex vertical style={{ height: '100vh', paddingTop: 20 }} gap={20}>
      <Row justify="center">
        <Col span={12}>
          <Flex justify="flex-end">
            <Button
              type="primary"
              onClick={async () => {
                const response = await addPet({
                  name: 'Ilya',
                  tags: [{ name: 'crazy' }],
                  photoUrls: [],
                });

                if (
                  response.error &&
                  'status' in response.error &&
                  response.error.status === 406
                ) {
                  void modal.error({
                    title: 'Something went wrong.',
                    content: 'Please, try again later',
                  });
                }
              }}
            >
              Add a pet
            </Button>
          </Flex>
        </Col>
      </Row>
      <Row justify="center" style={{ flex: 1, overflow: 'auto' }}>
        <Col span={12}>
          <List
            loading={addPetStatus.isLoading}
            dataSource={response.data.map((pet) => ({
              title: pet.name,
              description: (pet.tags ?? []).map((tag) => tag.name).join(', '),
            }))}
            renderItem={({ title, description }) => (
              <List.Item>
                <List.Item.Meta title={title} description={description} />
              </List.Item>
            )}
          />
        </Col>
      </Row>
      {ch}
    </Flex>
  );
};
