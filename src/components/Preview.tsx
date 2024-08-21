import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useEffect, useState } from 'react';
import { getPostById, handleComment } from '../helpers/api';
import { IComment, IPost } from '../helpers/types';
import { BASE, DEF } from '../helpers/default';
import { Link } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  height: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface IProps {
  open: boolean
  post: number
  onClose: () => void
}
export function Preview({ open, onClose, post }: IProps) {
  const [picture, setPicture] = useState<IPost>()
  const [text, setText] = useState<string>("")


  useEffect(() => {
    getPostById(post)
      .then(res => {
        if (res.status == "ok") {
          setPicture(res.payload as IPost)

        }

      })


  }, [post])


  const addComment = () => {
    handleComment(post, text)
      .then((res) => {
        if (picture) {
          setPicture({
            ...picture,
            comments: [...picture.comments, res.payload as IComment]
          })
        }
        setText("")

      })

  }

  return picture && (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h5">
            <div style={{ display: "flex", gap: 50 }}>
              <img className='img' src={BASE + picture.picture} />


              <div >
                <strong >{picture.likes.length} likes, {picture.comments.length} comments</strong>
                <p>likes:</p>
                {picture.likes.map(e => <div key={e.id} className='likesstyle'>
                  <img className='pic' src={e.picture ? BASE + e.picture : DEF} />
                  <Link to={"/profile/" + e.id}> <p style={{ marginBottom: "4px", }} >{e.name} {e.surname}</p></Link>
                </div>)}
                <div>
                  <p >comments:</p>
                  {picture.comments.map(elm => (
                    <div key={elm.id}>
                      <p style={{ fontSize: '14px', lineHeight: '14px' }}>
                        <strong>{elm.user.name}</strong> says:
                      </p>
                      <p style={{ fontSize: '14px', lineHeight: '14px' }}>
                        {elm.content}
                      </p>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 20 }}>
                  <textarea
                    style={{ height: 10 }}
                    className="form-control"
                    placeholder='what you think?'
                    value={text}
                    onChange={e => setText(e.target.value)}

                  />
                  <button onClick={() => addComment()} type="button" className="btn btn-primary btn-rounded" data-mdb-ripple-init>send</button>
                </div>
              </div>
            </div>
          </Typography>


        </Box>
      </Modal>
    </div>
  );
}
