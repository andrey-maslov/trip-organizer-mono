import React from 'react';
import {
  Typography,
  Form,
  Input,
  Modal,
  DatePicker,
  Select,
  Row,
  Col,
  Space,
  Button,
} from 'antd';
import { Section } from '../../../../../../libs/models/models';
import { AiOutlineMinusCircle } from 'react-icons/ai';
import { FORM_GUTTER } from '../../../constants/interface.constants';
import * as dayjs from 'dayjs';
import {
  currencyISONameList,
  sectionTypesList,
  statusTypesList,
  transportTypesList,
} from '../../../constants/system.constants';

const { RangePicker } = DatePicker;
const { Title } = Typography;
const { TextArea } = Input;

const rangeConfig = {
  rules: [{ type: 'array' as const }],
};

export type RangeTime = Record<string, any>[];
export type TripSectionValues = Section & { rangeTime?: RangeTime };

export type TripSectionModalProps = {
  open: boolean;
  initialData?: Section;
  onCreate: (values: Section) => void;
  onCancel: () => void;
};

export const TripSectionModal: React.FC<TripSectionModalProps> = ({
  open,
  initialData,
  onCreate,
  onCancel,
}) => {
  const [form] = Form.useForm();

  const onSetSectionData = () => {
    form
      .validateFields()
      .then((values: TripSectionValues) => {
        form.resetFields();

        const rangeTimeValue: RangeTime | undefined = values?.rangeTime;

        // stringified view like 2022-11-29T16:32:33.043Z;
        const dateTimeStart = rangeTimeValue?.[0]?.toISOString() || null;
        const dateTimeEnd = rangeTimeValue?.[0]?.toISOString() || null;

        if (initialData?._id) {
          onCreate({
            ...values,
            dateTimeStart,
            dateTimeEnd,
            _id: initialData._id,
          });
        } else {
          onCreate({ ...values, dateTimeStart, dateTimeEnd });
        }
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      open={open}
      title={
        initialData?._id ? 'Update this section' : 'Create a new trip section'
      }
      okText={initialData?._id ? 'Update' : 'Create'}
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={onSetSectionData}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          ...initialData,
          rangeTime: [
            dayjs(initialData?.dateTimeStart) || null,
            dayjs(initialData?.dateTimeEnd) || null,
          ],
        }}
      >
        <Row gutter={FORM_GUTTER}>
          <Col span={12}>
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
          </Col>

          <Col span={6}>
            <Form.Item
              name="type"
              label="Section type"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please input the Section type!',
                },
              ]}
            >
              <Select placeholder="Please select section type">
                {sectionTypesList.map((type) => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item name="status" label="Section status" hasFeedback>
              <Select placeholder="Please select section status">
                {statusTypesList.map((status) => (
                  <Select.Option key={status} value={status}>
                    {status.replace('_', ' ')}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="rangeTime"
          label="Select dates and times"
          {...rangeConfig}
        >
          <RangePicker showTime format="YYYY-MM-DD HH:mm" />
        </Form.Item>

        <Title level={5}>Geo points</Title>
        <Form.List name="points">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => {
                return (
                  <Space
                    key={key}
                    style={{ display: 'flex', marginBottom: 8 }}
                    align="baseline"
                  >
                    <span>Point&nbsp;{key + 1}</span>
                    <Form.Item {...restField} name={[name, 'name']}>
                      <Input placeholder="Name" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'country']}>
                      <Input placeholder="Country" />
                    </Form.Item>
                    <AiOutlineMinusCircle onClick={() => remove(name)} />
                  </Space>
                );
              })}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  + Add geo point
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Row gutter={FORM_GUTTER}>
          <Col span={6}>
            {/* TODO render label and options conditionally */}
            <Form.Item name="transport" label="Transport type" hasFeedback>
              <Select placeholder="Please select a transport type">
                {transportTypesList.map((type) => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={9}>
            <Form.Item
              name={['serviceProvider', 'name']}
              label="Service provider name"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={9}>
            <Form.Item
              name={['serviceProvider', 'link']}
              label="Service provider link"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Title level={5}>Payments</Title>
        <Form.List name="payments">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => {
                return (
                  <Space
                    key={key}
                    style={{ display: 'flex', marginBottom: 8 }}
                    align="baseline"
                  >
                    <span>P&nbsp;{key + 1}</span>
                    <Form.Item {...restField} name={[name, 'name']}>
                      <Input placeholder="Name" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'link']}>
                      <Input placeholder="Link" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'price', 'amount']}>
                      <Input placeholder="Price" type="number" />
                    </Form.Item>
                    <Form.Item name={[name, 'price', 'currency']} hasFeedback>
                      <Select placeholder="Currency">
                        {currencyISONameList.map((currency) => (
                          <Select.Option key={currency} value={currency}>
                            {currency}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <AiOutlineMinusCircle onClick={() => remove(name)} />
                  </Space>
                );
              })}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  + Add payment
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item name="notes" label="Notes">
          <TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
