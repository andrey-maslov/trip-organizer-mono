import React, { useState } from 'react';
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
import { Section, SectionType } from '../../../../../../libs/models/models';
import { AiOutlineMinusCircle } from 'react-icons/ai';
import { FORM_GUTTER } from '../../../constants/interface.constants';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import {
  currencyISONameList,
  DEFAULT_SECTION_STATUS,
  DEFAULT_SECTION_TYPE,
  placementTypeList,
  sectionTypesList,
  statusTypesList,
  transportTypesList,
} from '../../../constants/system.constants';
import {getHumanizedTimeDuration} from "../../../../../../libs/helpers/helpers";

import styles from './section-modal.module.scss'

const { RangePicker } = DatePicker;
const { Paragraph } = Typography;
const { TextArea } = Input;

const serviceProviderType: Record<SectionType, Record<string, any>> = {
  road: {
    data: transportTypesList,
    label: 'Transport type',
    fieldName: 'transportType',
    placeholder: 'Please select a transport type',
  },
  stay: {
    data: placementTypeList,
    label: 'Placement type',
    fieldName: 'placementType',
    placeholder: 'Please select a placement type',
  },
};

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
  const [sectionType, setSectionType] = useState(initialData?.type || DEFAULT_SECTION_TYPE);
  const [rangeTimeArr, setRangeTimeArr] = useState<Dayjs[]>([]);

  const [form] = Form.useForm();

  const onSectionTypeChange = (value: SectionType) => {
    if (!sectionTypesList.includes(value)) {
      return;
    }
    setSectionType(value);
  };

  const onSetSectionData = () => {
    form
      .validateFields()
      .then((values: TripSectionValues) => {
        form.resetFields();

        const rangeTimeValue: RangeTime | undefined = values?.rangeTime;

        // stringified view: 2022-11-29T16:32:33.043Z;
        const dateTimeStart = rangeTimeValue?.[0]?.toISOString() || null;
        const dateTimeEnd = rangeTimeValue?.[1]?.toISOString() || null;

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

  const defaultData = {
    type: DEFAULT_SECTION_TYPE,
    status: DEFAULT_SECTION_STATUS,
    ...initialData,
    rangeTime: [
      dayjs(initialData?.dateTimeStart) || null,
      dayjs(initialData?.dateTimeEnd) || null,
    ],
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
        initialValues={defaultData}
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
              style={{ marginBottom: "10px" }}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item name="type" label="Section type" style={{ marginBottom: "10px" }} hasFeedback>
              <Select
                placeholder="Please select section type"
                onChange={onSectionTypeChange}
              >
                {sectionTypesList.map((type) => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item name="status" label="Section status" hasFeedback style={{ marginBottom: "10px" }}>
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

        <Row>
          <Form.Item
            name="rangeTime"
            label="Select dates and times"
            {...rangeConfig}
            style={{ marginBottom: "10px" }}
          >
            <RangePicker
              showTime format="YYYY-MM-DD HH:mm"
              // @ts-ignore
              onOk={(list: Dayjs[]) => {
                if (list?.length === 2) {
                  setRangeTimeArr(list)
                }
              }}
            />
          </Form.Item>
          <div className={styles.duration}>= {getHumanizedTimeDuration(rangeTimeArr[0], rangeTimeArr[1])}</div>
        </Row>

        <Paragraph>Geo points</Paragraph>
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
                    <Form.Item {...restField} name={[name, 'name']} style={{ marginBottom: "10px" }}>
                      <Input placeholder="Name" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'country']} style={{ marginBottom: "10px" }}>
                      <Input placeholder="Country" />
                    </Form.Item>
                    <AiOutlineMinusCircle onClick={() => remove(name)} />
                  </Space>
                );
              })}
              <Form.Item style={{ marginBottom: "10px" }}>
                <Button type="dashed" onClick={() => add()} block>
                  + Add geo point
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Row gutter={FORM_GUTTER}>
          <Col span={6}>
            <Form.Item
              name={serviceProviderType[sectionType].fieldName}
              label={serviceProviderType[sectionType].label}
              style={{ marginBottom: "10px" }}
              hasFeedback
            >
              <Select
                placeholder={serviceProviderType[sectionType].placeholder}
              >
                {serviceProviderType[sectionType].data.map((type: string) => (
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
              style={{ marginBottom: "10px" }}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={9}>
            <Form.Item
              name={['serviceProvider', 'link']}
              label="Service provider link"
              style={{ marginBottom: "10px" }}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Paragraph>Payments</Paragraph>
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
                    <Form.Item {...restField} name={[name, 'name']} style={{ marginBottom: "10px" }}>
                      <Input placeholder="Name" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'link']} style={{ marginBottom: "10px" }}>
                      <Input placeholder="Link" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'price', 'amount']} style={{ marginBottom: "10px" }}>
                      <Input placeholder="Price" type="number" />
                    </Form.Item>
                    <Form.Item name={[name, 'price', 'currency']} style={{ marginBottom: "10px" }} hasFeedback>
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
              <Form.Item style={{ marginBottom: "10px" }}>
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
