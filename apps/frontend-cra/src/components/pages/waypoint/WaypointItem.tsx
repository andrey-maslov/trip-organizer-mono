import React, { useState } from 'react';
import { Waypoint } from '@/shared/models';
import { Button } from 'antd';
import { FaRegEdit } from 'react-icons/fa';
import ReactQuill from 'react-quill';

export type WaypointItemProps = {
  waypoint: Waypoint;
  onWaypointUpdate: (data: Waypoint) => void;
};

export const WaypointItem = (props: WaypointItemProps) => {
  const [richText, setRichText] = useState(props.waypoint?.description || '');
  const [editMode, setEditMode] = useState(false);

  const saveWaypoint = () => {
    props.onWaypointUpdate({ ...props.waypoint, description: richText });
    setEditMode(false);
  };

  return (
    <div>
      {!editMode ? (
        <div>
          <Button
            onClick={() => setEditMode(true)}
            style={{ marginBottom: '20px' }}
            icon={<FaRegEdit />}
          />
          <div
            dangerouslySetInnerHTML={{
              __html: props.waypoint?.description || 'you have no text here',
            }}
          />
        </div>
      ) : (
        <>
          <ReactQuill theme="snow" value={richText} onChange={setRichText} />
          <Button style={{ marginTop: '20px' }} onClick={() => saveWaypoint()}>
            Save
          </Button>
        </>
      )}
    </div>
  );
};
