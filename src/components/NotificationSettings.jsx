import { useState } from 'react';
import './NotificationSettings.css';

function getPermissionStatus() {
  if (typeof Notification === 'undefined') return 'unsupported';
  return Notification.permission;
}

export default function NotificationSettings({ settings, onUpdate, onRequestPermission }) {
  const [isOpen, setIsOpen] = useState(false);
  const [permStatus, setPermStatus] = useState(getPermissionStatus);

  async function handleRequestPermission() {
    const result = await onRequestPermission();
    setPermStatus(result);
    return result;
  }

  async function handleToggle(e) {
    const enabled = e.target.checked;
    if (enabled && Notification.permission !== 'granted') {
      const result = await handleRequestPermission();
      if (result !== 'granted') return;
    }
    onUpdate({ enabled });
  }

  return (
    <>
      <button
        className="notif-icon-btn"
        onClick={() => setIsOpen(true)}
        aria-label="通知設定"
        title="通知設定"
      >
        通知
      </button>
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <span className="modal-ttl">通知設定</span>
              <button className="modal-close" onClick={() => setIsOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="notif-row">
                <span className="notif-row-label">通知を有効にする</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.enabled}
                    onChange={handleToggle}
                  />
                  <span className="toggle-track" />
                </label>
              </div>
              <div className="notif-row">
                <span className="notif-row-label">通知時刻</span>
                <input
                  type="time"
                  value={settings.time}
                  onChange={(e) => onUpdate({ time: e.target.value })}
                  className="notif-time-input"
                  disabled={!settings.enabled}
                />
              </div>
              <div className="notif-perm">
                {permStatus === 'granted' && (
                  <span className="perm-ok">✓ 通知が許可されています</span>
                )}
                {permStatus === 'denied' && (
                  <span className="perm-err">✗ 通知がブロックされています。ブラウザの設定から許可してください。</span>
                )}
                {permStatus === 'default' && (
                  <button className="perm-btn" onClick={handleRequestPermission}>
                    通知を許可する
                  </button>
                )}
                {permStatus === 'unsupported' && (
                  <span className="perm-muted">このブラウザは通知に対応していません</span>
                )}
              </div>
              <p className="notif-note">当日の記録がない場合、指定した時刻にブラウザ通知を送ります（タブが開いている場合のみ）。</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
