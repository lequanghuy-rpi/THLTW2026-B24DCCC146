import React, { useMemo, useState } from 'react';
import { Tabs, message, Modal, Form, Input, Select, Switch, Radio, Table, Button } from 'antd';
import type { Club, Registration, HistoryRecord } from './types';
import { initialClubs, initialRegistrations } from './mock-data';
import { currentClubName } from './utils';
import ClubTab from './components/ClubTab';
import RequestTab from './components/RequestTab';
import MemberTab from './components/MemberTab';
import ReportsPanel from './components/ReportsPanel';

const TH05: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('clubs');
  const [clubs, setClubs] = useState<Club[]>(initialClubs);
  const [registrations, setRegistrations] = useState<Registration[]>(initialRegistrations);
  const [selectedRequestKeys, setSelectedRequestKeys] = useState<React.Key[]>([]);
  const [selectedMemberKeys, setSelectedMemberKeys] = useState<React.Key[]>([]);

  const [clubModalVisible, setClubModalVisible] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [clubForm] = Form.useForm<Omit<Club, 'id'>>();

  const [requestModalVisible, setRequestModalVisible] = useState(false);
  const [editingRequest, setEditingRequest] = useState<Registration | null>(null);
  const [requestForm] = Form.useForm<Omit<Registration, 'id' | 'status' | 'note'>>();

  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectTargetIds, setRejectTargetIds] = useState<React.Key[]>([]);
  const [rejectForm] = Form.useForm<{ rejectReason: string }>();

  const [viewMembersModalVisible, setViewMembersModalVisible] = useState(false);
  const [viewClubId, setViewClubId] = useState<string | null>(null);

  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [transferTargetClubId, setTransferTargetClubId] = useState<string | null>(null);

  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [histories, setHistories] = useState<HistoryRecord[]>([]);

  const members = useMemo(() => registrations.filter((item) => item.status === 'Approved'), [registrations]);

  const clubOptions = useMemo(
    () => clubs.map((club) => ({ label: club.name, value: club.id })),
    [clubs],
  );

  const createHistory = (entry: Omit<HistoryRecord, 'id' | 'timestamp'>) => {
    const record: HistoryRecord = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      timestamp: new Date().toLocaleString('vi-VN', { hour12: false }),
      ...entry,
    };
    setHistories((prev) => [record, ...prev]);
  };

  const handleOpenClubModal = (club?: Club) => {
    setEditingClub(club || null);
    setClubModalVisible(true);
    if (club) {
      clubForm.setFieldsValue(club as any);
    } else {
      clubForm.resetFields();
      clubForm.setFieldsValue({ avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=club', isActive: true });
    }
  };

  const handleClubModalSubmit = async () => {
    const values = await clubForm.validateFields();
    if (editingClub) {
      setClubs((prev) => prev.map((item) => (item.id === editingClub.id ? { ...item, ...values } : item)));
      createHistory({
        action: 'Updated',
        targetType: 'Club',
        targetName: values.name,
        actor: 'Admin',
        note: `Cập nhật thông tin CLB ${values.name}`,
      });
      message.success('Cập nhật CLB thành công');
    } else {
      const newClub: Club = { id: `club-${Date.now()}`, ...values };
      setClubs((prev) => [...prev, newClub]);
      createHistory({
        action: 'Created',
        targetType: 'Club',
        targetName: values.name,
        actor: 'Admin',
        note: `Tạo mới CLB ${values.name}`,
      });
      message.success('Thêm CLB mới thành công');
    }
    setClubModalVisible(false);
    clubForm.resetFields();
    setEditingClub(null);
  };

  const handleDeleteClub = (club: Club) => {
    setClubs((prev) => prev.filter((item) => item.id !== club.id));
    setRegistrations((prev) => prev.map((item) => (item.clubId === club.id ? { ...item, clubId: '' } : item)));
    createHistory({
      action: 'Deleted',
      targetType: 'Club',
      targetName: club.name,
      actor: 'Admin',
      note: `Xóa CLB ${club.name}`,
    });
    message.success('Đã xóa CLB');
  };

  const handleOpenRequestModal = (request?: Registration) => {
    setEditingRequest(request || null);
    setRequestModalVisible(true);
    if (request) {
      requestForm.setFieldsValue(request as any);
    } else {
      requestForm.resetFields();
      requestForm.setFieldsValue({ clubId: clubs[0]?.id, gender: 'Nam' });
    }
  };

  const handleRequestModalSubmit = async () => {
    const values = await requestForm.validateFields();
    if (editingRequest) {
      setRegistrations((prev) => prev.map((item) => (item.id === editingRequest.id ? { ...item, ...values } : item)));
      createHistory({
        action: 'Updated',
        targetType: 'Registration',
        targetName: values.fullName,
        clubName: currentClubName(clubs, values.clubId),
        actor: 'Admin',
        note: `Cập nhật đơn đăng ký ${values.fullName}`,
      });
      message.success('Cập nhật đơn đăng ký thành công');
    } else {
      const newRequest: Registration = {
        id: `req-${Date.now()}`,
        ...values,
        status: 'Pending',
      };
      setRegistrations((prev) => [...prev, newRequest]);
      createHistory({
        action: 'Created',
        targetType: 'Registration',
        targetName: values.fullName,
        clubName: currentClubName(clubs, values.clubId),
        actor: 'Admin',
        note: `Tạo mới đơn đăng ký ${values.fullName}`,
      });
      message.success('Thêm đơn đăng ký thành công');
    }
    setRequestModalVisible(false);
    requestForm.resetFields();
    setEditingRequest(null);
  };

  const handleDeleteRequest = (registration: Registration) => {
    setRegistrations((prev) => prev.filter((item) => item.id !== registration.id));
    createHistory({
      action: 'Deleted',
      targetType: 'Registration',
      targetName: registration.fullName,
      clubName: currentClubName(clubs, registration.clubId),
      actor: 'Admin',
      note: `Xóa đơn đăng ký ${registration.fullName}`,
    });
    message.success('Đã xóa đơn đăng ký');
  };

  const handleApproveRequests = (keys: React.Key[]) => {
    setRegistrations((prev) =>
      prev.map((item) =>
        keys.includes(item.id) && item.status === 'Pending'
          ? { ...item, status: 'Approved' as Registration['status'], note: item.note }
          : item,
      ),
    );
    const approvedCount = registrations.filter((item) => keys.includes(item.id) && item.status === 'Pending').length;
    if (approvedCount) {
      createHistory({
        action: 'Approved',
        targetType: 'Member',
        targetName: `${approvedCount} thành viên`,
        actor: 'Admin',
        note: `Duyệt ${approvedCount} đơn đăng ký`,
      });
      message.success(`Đã duyệt ${approvedCount} đơn đăng ký`);
    }
    setSelectedRequestKeys([]);
  };

  const handleOpenRejectModal = (keys: React.Key[]) => {
    setRejectTargetIds(keys);
    setRejectModalVisible(true);
    rejectForm.resetFields();
  };

  const handleRejectSubmit = async () => {
    const values = await rejectForm.validateFields();
    setRegistrations((prev) =>
      prev.map((item) =>
        rejectTargetIds.includes(item.id) && item.status === 'Pending'
          ? { ...item, status: 'Rejected' as Registration['status'], note: values.rejectReason }
          : item,
      ),
    );
    const rejectedCount = registrations.filter((item) => rejectTargetIds.includes(item.id) && item.status === 'Pending').length;
    if (rejectedCount) {
      createHistory({
        action: 'Rejected',
        targetType: 'Registration',
        targetName: `${rejectedCount} đơn`,
        actor: 'Admin',
        note: `Từ chối ${rejectedCount} đơn với lý do: ${values.rejectReason}`,
      });
      message.success(`Đã từ chối ${rejectedCount} đơn`);
    }
    setRejectModalVisible(false);
    setRejectTargetIds([]);
    setSelectedRequestKeys([]);
    rejectForm.resetFields();
  };

  const handleViewClubMembers = (clubId: string) => {
    setViewClubId(clubId);
    setViewMembersModalVisible(true);
  };

  const handleTransferMembers = () => {
    if (!transferTargetClubId) {
      message.warning('Vui lòng chọn CLB muốn chuyển đến');
      return;
    }
    setRegistrations((prev) =>
      prev.map((item) =>
        selectedMemberKeys.includes(item.id) && item.status === 'Approved'
          ? { ...item, clubId: transferTargetClubId }
          : item,
      ),
    );
    const transferCount = registrations.filter((item) => selectedMemberKeys.includes(item.id) && item.status === 'Approved').length;
    if (transferCount) {
      createHistory({
        action: 'Transferred',
        targetType: 'Member',
        targetName: `${transferCount} thành viên`,
        actor: 'Admin',
        clubName: currentClubName(clubs, transferTargetClubId),
        note: `Chuyển ${transferCount} thành viên sang CLB ${currentClubName(clubs, transferTargetClubId)}`,
      });
      message.success(`Đã chuyển ${transferCount} thành viên`);
    }
    setTransferModalVisible(false);
    setTransferTargetClubId(null);
    setSelectedMemberKeys([]);
  };

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: '100vh' }}>
      <h2>Quản lý Câu lạc bộ và Đăng ký tham gia</h2>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab="Danh sách CLB" key="clubs">
          <ClubTab
            clubs={clubs}
            onCreate={() => handleOpenClubModal()}
            onEdit={handleOpenClubModal}
            onDelete={handleDeleteClub}
            onViewMembers={handleViewClubMembers}
          />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Đơn đăng ký" key="requests">
          <RequestTab
            registrations={registrations}
            clubs={clubs}
            selectedKeys={selectedRequestKeys}
            setSelectedKeys={setSelectedRequestKeys}
            onCreate={() => handleOpenRequestModal()}
            onEdit={handleOpenRequestModal}
            onDelete={handleDeleteRequest}
            onApprove={handleApproveRequests}
            onReject={handleOpenRejectModal}
            onOpenHistory={() => setHistoryModalVisible(true)}
          />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Thành viên" key="members">
          <MemberTab
            members={members}
            clubs={clubs}
            selectedKeys={selectedMemberKeys}
            setSelectedKeys={setSelectedMemberKeys}
            onEdit={handleOpenRequestModal}
            onOpenTransfer={() => setTransferModalVisible(true)}
          />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Báo cáo" key="reports">
          <ReportsPanel clubs={clubs} registrations={registrations} />
        </Tabs.TabPane>
      </Tabs>

      <Modal
        title={editingClub ? 'Chỉnh sửa CLB' : 'Thêm mới CLB'}
        visible={clubModalVisible}
        onOk={handleClubModalSubmit}
        onCancel={() => {
          setClubModalVisible(false);
          setEditingClub(null);
          clubForm.resetFields();
        }}
        okText={editingClub ? 'Lưu' : 'Tạo'}
        cancelText="Hủy"
      >
        <Form form={clubForm} layout="vertical" initialValues={{ isActive: true }}>
          <Form.Item name="avatar" label="URL ảnh đại diện" rules={[{ required: true, message: 'Nhập URL ảnh đại diện' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Tên CLB" rules={[{ required: true, message: 'Nhập tên CLB' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="foundedDate" label="Ngày thành lập" rules={[{ required: true, message: 'Nhập ngày thành lập' }]}>
            <Input placeholder="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="president" label="Chủ nhiệm CLB" rules={[{ required: true, message: 'Nhập chủ nhiệm CLB' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả (HTML)" rules={[{ required: true, message: 'Nhập mô tả CLB' }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="isActive" label="Hoạt động" valuePropName="checked">
            <Switch checkedChildren="Có" unCheckedChildren="Không" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editingRequest ? 'Chỉnh sửa đơn đăng ký' : 'Thêm mới đơn đăng ký'}
        visible={requestModalVisible}
        onOk={handleRequestModalSubmit}
        onCancel={() => {
          setRequestModalVisible(false);
          setEditingRequest(null);
          requestForm.resetFields();
        }}
        okText={editingRequest ? 'Lưu' : 'Tạo'}
        cancelText="Hủy"
        width={700}
      >
        <Form form={requestForm} layout="vertical" initialValues={{ gender: 'Nam', clubId: clubs[0]?.id }}>
          <Form.Item name="fullName" label="Họ tên" rules={[{ required: true, message: 'Nhập họ tên' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'Email không hợp lệ' }, { required: true, message: 'Nhập email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="SĐT" rules={[{ required: true, message: 'Nhập số điện thoại' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: 'Chọn giới tính' }]}>
            <Radio.Group>
              <Radio value="Nam">Nam</Radio>
              <Radio value="Nữ">Nữ</Radio>
              <Radio value="Khác">Khác</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Nhập địa chỉ' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="skill" label="Sở trường" rules={[{ required: true, message: 'Nhập sở trường' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="clubId" label="Chọn CLB" rules={[{ required: true, message: 'Chọn câu lạc bộ' }]}>
            <Select options={clubOptions} />
          </Form.Item>
          <Form.Item name="reason" label="Lý do đăng ký" rules={[{ required: true, message: 'Nhập lý do đăng ký' }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Từ chối đơn đăng ký"
        visible={rejectModalVisible}
        okText="Xác nhận từ chối"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
        onOk={handleRejectSubmit}
        onCancel={() => {
          setRejectModalVisible(false);
          setRejectTargetIds([]);
          rejectForm.resetFields();
        }}
      >
        <Form form={rejectForm} layout="vertical">
          <Form.Item
            name="rejectReason"
            label="Lý do từ chối"
            rules={[
              { required: true, message: 'Bắt buộc phải nhập lý do từ chối' },
              { min: 5, message: 'Lý do quá ngắn' },
            ]}
          >
            <Input.TextArea rows={4} placeholder="Nhập lý do từ chối..." />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Danh sách thành viên của CLB ${currentClubName(clubs, viewClubId || '')}`}
        visible={viewMembersModalVisible}
        footer={null}
        onCancel={() => {
          setViewMembersModalVisible(false);
          setViewClubId(null);
        }}
        width={800}
      >
        <Table
          columns={[
            { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' },
            { title: 'Email', dataIndex: 'email', key: 'email' },
            { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
            { title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
            { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
            { title: 'Sở trường', dataIndex: 'skill', key: 'skill' },
          ]}
          dataSource={members.filter((member) => member.clubId === viewClubId)}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Modal>

      <Modal
        title="Chuyển CLB cho thành viên"
        visible={transferModalVisible}
        okText="Xác nhận"
        cancelText="Hủy"
        onOk={handleTransferMembers}
        onCancel={() => {
          setTransferModalVisible(false);
          setTransferTargetClubId(null);
        }}
      >
        <Form layout="vertical">
          <Form.Item label="Số thành viên được chọn">
            <span>{selectedMemberKeys.length}</span>
          </Form.Item>
          <Form.Item label="Chọn CLB chuyển đến">
            <Select
              options={clubOptions}
              value={transferTargetClubId || undefined}
              onChange={(value) => setTransferTargetClubId(value)}
              placeholder="Chọn CLB mới"
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Lịch sử thao tác"
        visible={historyModalVisible}
        footer={<Button onClick={() => setHistoryModalVisible(false)}>Đóng</Button>}
        onCancel={() => setHistoryModalVisible(false)}
        width={800}
      >
        <Table
          columns={[
            { title: 'Thời gian', dataIndex: 'timestamp', key: 'timestamp' },
            { title: 'Hành động', dataIndex: 'action', key: 'action' },
            { title: 'Loại', dataIndex: 'targetType', key: 'targetType' },
            { title: 'Tên mục tiêu', dataIndex: 'targetName', key: 'targetName' },
            { title: 'CLB liên quan', dataIndex: 'clubName', key: 'clubName' },
            { title: 'Ghi chú', dataIndex: 'note', key: 'note' },
          ]}
          dataSource={histories}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Modal>
    </div>
  );
};

export default TH05;
