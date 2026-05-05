import React, { useState } from 'react';
import { Tabs, Table, Button, Modal, Form, Input, Select, message, Space } from 'antd';

const TH02p2 = () => {
    const [khoi, setKhoi] = useState([{ id: '1', ten: 'Tổng quan' }, { id: '2', ten: 'Chuyên sâu' }]);
    const [mon, setMon] = useState([{ maMon: 'TH01', tenMon: 'Tin học đại cương', soTinChi: 3 }]);
    const [cauHoi, setCauHoi] = useState([{ maCauHoi: 'RIPT01', monHoc: 'TH01', noiDung: 'Thuật toán là gì ?', mucDoKho: 'Dễ', khoiKienThuc: '1' }]);
    const [cauTrucList, setCauTrucList] = useState<any[]>([]);
    const [deThiList, setDeThiList] = useState<any[]>([]);

    const [isModal, setIsModal] = useState(false);
    const [type, setType] = useState(''); 
    const [form] = Form.useForm();

    const handleOk = () => {
        form.validateFields().then(values => {
            const id = Date.now().toString();
            if (type === 'khoi') setKhoi([...khoi, { id, ten: values.ten }]);
            if (type === 'mon') setMon([...mon, values]);
            if (type === 'cauhoi') setCauHoi([...cauHoi, { ...values, maCauHoi: 'RIPT' + id }]);
            if (type === 'cautruc') setCauTrucList([...cauTrucList, { id, ...values }]);
            
            if (type === 'dethi') {
                const ct = cauTrucList.find(c => c.id === values.cauTruc);
                let selected: string[] = [];
                try {
                    ct.yeuCau.forEach((req: any) => {
                        const matches = cauHoi.filter(q => q.monHoc === ct.monHoc && q.mucDoKho === req.mucDoKho && q.khoiKienThuc === req.khoiKienThuc);
                        if (matches.length < req.soLuong) throw new Error(`Thiếu câu hỏi ${req.mucDoKho}`);
                        selected.push(...matches.slice(0, req.soLuong).map(q => q.maCauHoi));
                    });
                    setDeThiList([...deThiList, { id, ten: 'Đề ' + ct.ten, monHoc: ct.monHoc, dsCH: selected }]);
                } catch (e: any) { return message.error(e.message); }
            }
            message.success('Thành công');
            setIsModal(false);
        });
    };

    const renderForm = () => {
        if (type === 'khoi') return <Form.Item name="ten" label="Tên khối"><Input /></Form.Item>;
        if (type === 'mon') return <><Form.Item name="maMon" label="Mã môn"><Input /></Form.Item><Form.Item name="tenMon" label="Tên môn"><Input /></Form.Item><Form.Item name="soTinChi" label="Tín chỉ"><Input /></Form.Item></>;
        if (type === 'cauhoi') return <>
            <Form.Item name="monHoc" label="Môn"><Select>{mon.map(m => <Select.Option value={m.maMon}>{m.tenMon}</Select.Option>)}</Select></Form.Item>
            <Form.Item name="noiDung" label="Nội dung"><Input.TextArea /></Form.Item>
            <Form.Item name="mucDoKho" label="Độ khó"><Select><Select.Option value="Dễ">Dễ</Select.Option><Select.Option value="Khó">Khó</Select.Option></Select></Form.Item>
            <Form.Item name="khoiKienThuc" label="Khối"><Select>{khoi.map(k => <Select.Option value={k.id}>{k.ten}</Select.Option>)}</Select></Form.Item>
        </>;
        if (type === 'cautruc') return <>
            <Form.Item name="ten" label="Tên cấu trúc"><Input /></Form.Item>
            <Form.Item name="monHoc" label="Môn"><Select>{mon.map(m => <Select.Option value={m.maMon}>{m.tenMon}</Select.Option>)}</Select></Form.Item>
            <Form.List name="yeuCau">{(fields, { add, remove }) => (<>
                {fields.map(({ key, name }) => (
                    <Space key={key} align="baseline">
                        <Form.Item name={[name, 'mucDoKho']}><Select placeholder="Độ khó"><Select.Option value="Dễ">Dễ</Select.Option><Select.Option value="Khó">Khó</Select.Option></Select></Form.Item>
                        <Form.Item name={[name, 'khoiKienThuc']}><Select placeholder="Khối">{khoi.map(k => <Select.Option value={k.id}>{k.ten}</Select.Option>)}</Select></Form.Item>
                        <Form.Item name={[name, 'soLuong']}><Input placeholder="SL" /></Form.Item>
                        <Button onClick={() => remove(name)}>X</Button>
                    </Space>
                ))}
                <Button onClick={() => add()} block>+ Thêm yêu cầu</Button>
            </>)}</Form.List>
        </>;
        if (type === 'dethi') return <Form.Item name="cauTruc" label="Chọn cấu trúc"><Select>{cauTrucList.map(c => <Select.Option value={c.id}>{c.ten}</Select.Option>)}</Select></Form.Item>;
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Quản lý Đề thi Tự luận</h2>
            <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="Khối kiến thức" key="1">
                    <Button onClick={() => { setType('khoi'); setIsModal(true); form.resetFields(); }}>Thêm Khối</Button>
                    <Table dataSource={khoi} columns={[{ title: 'Tên khối', dataIndex: 'ten' }]} />
                </Tabs.TabPane>
                
                <Tabs.TabPane tab="Môn học" key="2">
                    <Button onClick={() => { setType('mon'); setIsModal(true); form.resetFields(); }}>Thêm Môn</Button>
                    <Table dataSource={mon} columns={[{ title: 'Mã', dataIndex: 'maMon' }, { title: 'Tên', dataIndex: 'tenMon' }, { title: 'Tín chỉ', dataIndex: 'soTinChi' }]} />
                </Tabs.TabPane>

                <Tabs.TabPane tab="Câu hỏi" key="3">
                    <Button onClick={() => { setType('cauhoi'); setIsModal(true); form.resetFields(); }}>Thêm Câu hỏi</Button>
                    <Table dataSource={cauHoi} columns={[{ title: 'ID', dataIndex: 'maCauHoi' }, { title: 'Nội dung', dataIndex: 'noiDung' }, { title: 'Độ khó', dataIndex: 'mucDoKho' }]} />
                </Tabs.TabPane>

                <Tabs.TabPane tab="Đề thi" key="4">
                    <Space>
                        <Button onClick={() => { setType('cautruc'); setIsModal(true); form.resetFields(); }}>1. Tạo cấu trúc</Button>
                        <Button type="primary" onClick={() => { setType('dethi'); setIsModal(true); form.resetFields(); }}>2. Xuất đề thi</Button>
                    </Space>
                    <Table dataSource={deThiList} columns={[{ title: 'Tên đề', dataIndex: 'ten' }, { title: 'Số câu', dataIndex: 'dsCH', render: (ds) => ds.length }]} />
                </Tabs.TabPane>
            </Tabs>

            <Modal title="Nhập thông tin" visible={isModal} onOk={handleOk} onCancel={() => setIsModal(false)}>
                <Form form={form} layout="vertical">{renderForm()}</Form>
            </Modal>
        </div>
    );
};

export default TH02p2;