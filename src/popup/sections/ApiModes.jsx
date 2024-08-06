import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { apiModeToModelName, modelNameToDesc } from '../../utils/index.mjs'
import { PencilIcon, TrashIcon } from '@primer/octicons-react'
import { useState } from 'react'
import {
  AlwaysCustomGroups,
  CustomApiKeyGroups,
  CustomUrlGroups,
  ModelGroups,
} from '../../config/index.mjs'

ApiModes.propTypes = {
  config: PropTypes.object.isRequired,
  updateConfig: PropTypes.func.isRequired,
}

const defaultApiMode = {
  groupName: 'chatgptWebModelKeys',
  itemName: 'chatgptFree35',
  isCustom: false,
  customName: '',
  customUrl: '',
  apiKey: '',
  active: true,
}

export function ApiModes({ config, updateConfig }) {
  const { t } = useTranslation()
  const [editing, setEditing] = useState(false)
  const [editingApiMode, setEditingApiMode] = useState(defaultApiMode)
  const [editingIndex, setEditingIndex] = useState(-1)

  const editingComponent = (
    <div style={{ display: 'flex', flexDirection: 'column', '--spacing': '4px' }}>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={(e) => {
            e.preventDefault()
            setEditing(false)
          }}
        >
          {t('Cancel')}
        </button>
        <button
          onClick={(e) => {
            e.preventDefault()
            if (editingIndex === -1) {
              updateConfig({
                customApiModes: [...config.customApiModes, editingApiMode],
              })
            } else {
              const customApiModes = [...config.customApiModes]
              customApiModes[editingIndex] = editingApiMode
              updateConfig({ customApiModes })
            }
            setEditing(false)
          }}
        >
          {t('Save')}
        </button>
      </div>
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center', whiteSpace: 'noWrap' }}>
        {t('Type')}
        <select
          value={editingApiMode.groupName}
          onChange={(e) => {
            const groupName = e.target.value
            const itemName = ModelGroups[groupName].value[0]
            setEditingApiMode({ ...editingApiMode, groupName, itemName })
          }}
        >
          {Object.entries(ModelGroups).map(([groupName, { desc }]) => (
            <option key={groupName} value={groupName}>
              {t(desc)}
            </option>
          ))}
        </select>
      </div>
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center', whiteSpace: 'noWrap' }}>
        {t('Mode')}
        <select
          value={editingApiMode.itemName}
          onChange={(e) => {
            const itemName = e.target.value
            const isCustom = itemName === 'custom'
            setEditingApiMode({ ...editingApiMode, itemName, isCustom })
          }}
        >
          {ModelGroups[editingApiMode.groupName].value.map((itemName) => (
            <option key={itemName} value={itemName}>
              {modelNameToDesc(itemName, t)}
            </option>
          ))}
          {!AlwaysCustomGroups.includes(editingApiMode.groupName) && (
            <option value="custom">{t('Custom')}</option>
          )}
        </select>
        {(editingApiMode.isCustom || AlwaysCustomGroups.includes(editingApiMode.groupName)) && (
          <input
            type="text"
            value={editingApiMode.customName}
            placeholder={t('Model Name')}
            onChange={(e) => setEditingApiMode({ ...editingApiMode, customName: e.target.value })}
          />
        )}
      </div>
      {CustomUrlGroups.includes(editingApiMode.groupName) &&
        (editingApiMode.isCustom || AlwaysCustomGroups.includes(editingApiMode.groupName)) && (
          <input
            type="text"
            value={editingApiMode.customUrl}
            placeholder={t('API Url')}
            onChange={(e) => setEditingApiMode({ ...editingApiMode, customUrl: e.target.value })}
          />
        )}
      {CustomApiKeyGroups.includes(editingApiMode.groupName) &&
        (editingApiMode.isCustom || AlwaysCustomGroups.includes(editingApiMode.groupName)) && (
          <input
            type="password"
            value={editingApiMode.apiKey}
            placeholder={t('API Key')}
            onChange={(e) => setEditingApiMode({ ...editingApiMode, apiKey: e.target.value })}
          />
        )}
    </div>
  )

  return (
    <>
      {config.customApiModes.map(
        (apiMode, index) =>
          apiMode.groupName &&
          apiMode.itemName &&
          (editing && editingIndex === index ? (
            editingComponent
          ) : (
            <label key={index} style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={apiMode.active}
                onChange={(e) => {
                  const customApiModes = [...config.customApiModes]
                  customApiModes[index] = { ...apiMode, active: e.target.checked }
                  updateConfig({ customApiModes })
                }}
              />
              {modelNameToDesc(apiModeToModelName(apiMode), t)}
              <div style={{ flexGrow: 1 }} />
              <div style={{ display: 'flex', gap: '12px' }}>
                <div
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    e.preventDefault()
                    setEditing(true)
                    setEditingApiMode(apiMode)
                    setEditingIndex(index)
                  }}
                >
                  <PencilIcon />
                </div>
                <div
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    e.preventDefault()
                    const customApiModes = [...config.customApiModes]
                    customApiModes.splice(index, 1)
                    updateConfig({ customApiModes })
                  }}
                >
                  <TrashIcon />
                </div>
              </div>
            </label>
          )),
      )}
      <div style={{ height: '30px' }} />
      {editing ? (
        editingIndex === -1 ? (
          editingComponent
        ) : undefined
      ) : (
        <button
          onClick={(e) => {
            e.preventDefault()
            setEditing(true)
            setEditingApiMode(defaultApiMode)
            setEditingIndex(-1)
          }}
        >
          {t('New')}
        </button>
      )}
    </>
  )
}
