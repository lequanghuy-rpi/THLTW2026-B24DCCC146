import React, {useState, } from "react";
import { Form, Input, InputNumber, DatePicker, Button, Table, Tabs,  Card, Space, Tag, Alert, message } from 'antd';
import { SearchOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';

type DataType = 'String' | 'Number' | 'Date';
interface ConfigField { id: string; label: string; type: DataType }

const { TabPane } = Tabs;

const TH04: React.FC = () => {
  const [form] = Form.useForm();
  
  const [configFields] = useState<ConfigField[]>([
    { id: 'danToc', label: 'Dân tộc', type: 'String' },
    { id: 'diemTB', label: 'Điểm trung bình', type: 'Number' },
  ]);

  const [soVanBang, setSoVanBang] = useState({ nam: 2026, soHienTai: 0 });
  const [diplomas, setDiplomas] = useState<any[]>([]);
  const [searchResult, setSearchResult] = useState<any[] | null>(null);

 
  const handleAddDiploma = (values: any) => {
    const newSoVaoSo = soVanBang.soHienTai + 1;
    const newEntry = {
      ...values,
      soVaoSo: newSoVaoSo,
      key: Date.now(),
    };
    
    setDiplomas([...diplomas, newEntry]);
    setSoVanBang({ ...soVanBang, soHienTai: newSoVaoSo }); 
    form.resetFields(['maSV', 'hoTen', 'soHieu', 'extraData']);
    message.success(`Đã cấp số vào sổ: ${newSoVaoSo}`);
  };

  const onSearch = (values: any) => {
    const filledFields = Object.values(values).filter(v => v !== undefined && v !== '').length;
    if (filledFields < 2) {
      message.error("Vui lòng nhập ít nhất 2 thông tin để tra cứu!");
      return;
    }

    const result = diplomas.filter(item => 
      (values.soHieu && item.soHieu === values.soHieu) || 
      (values.maSV && item.maSV === values.maSV)
    );
    setSearchResult(result);
  };

  return (
    <div style={{ padding: 24, background: '#f5f5f5', minHeight: '100vh' }}>
      <Card title="HỆ THỐNG QUẢN LÝ VĂN BẰNG TỐT NGHIỆP" bordered={false}>
        <Tabs defaultActiveKey="1">
          
          <TabPane tab={<span><PlusOutlined />Quản lý & Cấp bằng</span>} key="1">
            <Alert message={`Sổ văn bằng năm: ${soVanBang.nam} - Số vào sổ tiếp theo: ${soVanBang.soHienTai + 1}`} type="info" showIcon style={{ marginBottom: 20 }} />
            <Form form={form} layout="vertical" onFinish={handleAddDiploma}>
              <Space align="start" size="large">
                <div style={{ width: 400 }}>
                  <h4>Thông tin mặc định</h4>
                  <Form.Item label="Số vào sổ"><Input value={soVanBang.soHienTai + 1} disabled /></Form.Item>
                  <Form.Item name="soHieu" label="Số hiệu văn bằng" rules={[{ required: true }]}><Input /></Form.Item>
                  <Form.Item name="maSV" label="Mã sinh viên" rules={[{ required: true }]}><Input /></Form.Item>
                  <Form.Item name="hoTen" label="Họ tên" rules={[{ required: true }]}><Input /></Form.Item>
                </div>

                <div style={{ width: 400 }}>
                  <h4>Thông tin phụ lục </h4>
                  {configFields.map(field => (
                    <Form.Item key={field.id} name={['extraData', field.id]} label={field.label}>
                      {field.type === 'Number' ? <InputNumber style={{ width: '100%' }} /> :
                       field.type === 'Date' ? <DatePicker style={{ width: '100%' }} /> : <Input />}
                    </Form.Item>
                  ))}
                  <Button type="primary" htmlType="submit" block icon={<PlusOutlined />} style={{ marginTop: 20 }}>
                    Thêm vào sổ văn bằng
                  </Button>
                </div>
              </Space>
            </Form>
          </TabPane>

   
          <TabPane tab={<span><SearchOutlined />Tra cứu văn bằng</span>} key="2">
            <Form layout="inline" onFinish={onSearch} style={{ marginBottom: 20 }}>
              <Form.Item name="soHieu"><Input placeholder="Số hiệu" /></Form.Item>
              <Form.Item name="maSV"><Input placeholder="Mã SV" /></Form.Item>
              <Form.Item name="hoTen"><Input placeholder="Họ tên" /></Form.Item>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>Tìm kiếm</Button>
            </Form>
            
            {searchResult && (
              <Table 
                dataSource={searchResult} 
                columns={[
                  { title: 'Số vào sổ', dataIndex: 'soVaoSo' },
                  { title: 'Số hiệu', dataIndex: 'soHieu' },
                  { title: 'Họ tên', dataIndex: 'hoTen' },
                  { title: 'Mã SV', dataIndex: 'maSV' },
                  { title: 'Dữ liệu phụ lục', render: (record) => JSON.stringify(record.extraData) }
                ]} 
              />
            )}
          </TabPane>

          <TabPane tab={<span><SettingOutlined />Cấu hình biểu mẫu</span>} key="3">
            <Table 
              dataSource={configFields}
              rowKey="id"
              columns={[
                { title: 'Tên trường', dataIndex: 'label' },
                { title: 'Kiểu dữ liệu', dataIndex: 'type', render: (type) => <Tag color="blue">{type}</Tag> },
                { title: 'Thao tác', render: () => <Button type="link" danger>Xóa</Button> }
              ]}
              footer={() => <Button type="dashed" block icon={<PlusOutlined />}>Thêm trường thông tin mới</Button>}
            />
          </TabPane>
          
        </Tabs>
      </Card>
    </div>
  );
}
export default TH04;