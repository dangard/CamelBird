<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Album_model extends CI_Model {
	public function getAll() {
		$q = $this->db->get('album');
		
		if ($q->num_rows() > 0) {
			foreach ($q->result() as $row)
			{
				$data[] = $row;
			}
			return $data;
		}
	}

	public function get() {
		if( $this->uri->segment(3) !== false ) {
			$this->db->where('id', $this->uri->segment(3));
			$q = $this->db->get('album');
			if ($q->num_rows() > 0) {
				foreach ($q->result() as $row)
				{
					$data[] = $row;
				}
				return $data;
			}
		} else {
			return false;
		}
	}

	public function create() {
		$album_data = array(
			'name' => $this->input->post('name'),
			'description' => $this->input->post('description'),
			'author' => $this->input->post('author'),			s
			'keywords' => $this->input->post('keywords')						
		);
		
		$insert = $this->db->insert('album', $album_data);
		return $insert;
	}

	public function update() {
		if( $this->uri->segment(3) !== false ) {
			$this->db->where('id', $this->uri->segment(3));
			$album_data = array(
				'name' => $this->input->post('name'),
				'description' => $this->input->post('description'),
				'author' => $this->input->post('author'),			
				'keywords' => $this->input->post('keywords')						
			);
			
			$update = $this->db->update('album', $album_data);
			return $update;
		} else {
			return false;
		}
	}

	public function delete() {
		if( $this->uri->segment(3) !== false ) {
			$this->db->where('id', $this->uri->segment(3));
			$delete = $this->db->delete('album');
			return $delete;
		} else {
			return false;
		}
	}
}