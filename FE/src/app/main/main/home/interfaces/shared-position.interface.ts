export interface ISharedPosition {
  positionSharingId: number;
  sharedByUser: {
    username: string;
    city: string;
    position: string;
    profileImage: string;
    userId: number;
  };
}
