export interface LeadershipMember {
  id: string;
  name: string;
  position: string;
  photo?: string;
  bio?: string;
  email?: string;
  term?: string;
}

export interface PastPresident {
  id: string;
  name: string;
  photo?: string;
  term: string;
  description?: string;
}
