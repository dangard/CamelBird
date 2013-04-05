<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Photo_model extends CI_Model {
	public function getAll() {
		$q = $this->db->get('photo');
		
		if ($q->num_rows() > 0) {
			foreach ($q->result() as $row)
			{
				$data[] = $row;
			}
			return $data;
		} else {
			return false;
		}
	}

	public function get() {
		if( $this->uri->segment(3) !== false ) {
			$this->db->where('id', $this->uri->segment(3));
			$q = $this->db->get('photo');
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
		$photo_data = array(
			'name' => $this->input->post('name'),
			'description' => $this->input->post('description'),
			'url' => $this->input->post('url'),			
			'author' => $this->input->post('author')						
		);
		
		$insert = $this->db->insert('photo', $photo_data);
		return $insert;
	}

	public function update() {
		if( $this->uri->segment(3) !== false ) {
			$this->db->where('id', $this->uri->segment(3));
			$photo_data = array(
				'name' => $this->input->post('name'),
				'description' => $this->input->post('description'),
				'url' => $this->input->post('url'),			
				'author' => $this->input->post('author')						
			);
			
			$update = $this->db->update('photo', $photo_data);
			return $update;
		} else {
			return false;
		}
	}

	public function delete() {
		if( $this->uri->segment(3) !== false ) {
			$this->db->where('id', $this->uri->segment(3));
			$delete = $this->db->delete('photo');
			return $delete;
		} else {
			return false;
		}
	}
}