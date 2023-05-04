import React from 'react';
import dayjs from 'dayjs';
import { Form, Input, Modal, DatePicker, Row, Col } from 'antd';
import { Trip } from '@/shared/models';
import { FORM_GUTTER } from '@/shared/constants';

const { TextArea } = Input;

export type TripValues = Trip;

export type TripModalProps = {
  open: boolean;
  initialData?: TripValues;
  onCreate: (values: TripValues) => void;
  onUpdate: (values: TripValues) => void;
  onCancel: () => void;
  loading?: boolean;
};

export const TripModal: React.FC<TripModalProps> = ({
  open,
  initialData,
  onCreate,
  onUpdate,
  onCancel,
  loading = false,
}) => {
  const [form] = Form.useForm();

  const onSetTripData = () => {
    form
      .validateFields()
      .then((values: TripValues) => {

        const start = values.dateTimeStart
          ? values.dateTimeStart.toString()
          : null;
        const end = values.dateTimeEnd ? values.dateTimeEnd.toString() : null;

        const dataToSave = { ...values, dateStart: start, dateEnd: end };

        if (initialData?._id) {
          onUpdate({ ...dataToSave, _id: initialData._id });
        } else {
          onCreate(dataToSave);
        }
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const defaultData = {
    ...initialData,
    dateTimeStart: dayjs(initialData?.dateTimeStart),
    dateTimeEnd: dayjs(initialData?.dateTimeEnd),
  };

  return (
    <Modal
      open={open}
      title={initialData?._id ? 'Update this journey' : 'Create a new journey'}
      okText={initialData?._id ? 'Update' : 'Create'}
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={onSetTripData}
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={defaultData}
      >
        <Form.Item
          name="name"
          label="Section name"
          rules={[
            {
              required: true,
              message: 'Please input the Section name!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Row gutter={FORM_GUTTER}>
          <Col span={12}>
            <Form.Item name="dateTimeStart" label="Journey start date">
              <DatePicker />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="dateTimeEnd" label="Journey end date">
              <DatePicker />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Description">
          <TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
