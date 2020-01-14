import { gql } from 'apollo-boost'

//ACCEPTED
export const ACCEPTED_REVIEWS_BY_SEEKER = gql`
query{
    acceptedReviewsBySeeker{
        id
        isAccepted
        dateAccepted
        createdAt
        updatedAt
        coach{
            id
            first_name
            last_name
            email
        }
        seeker{
            id
            first_name
            last_name
            email
        }
    }
}
`

//DENIED
export const DENIED_REVIEWS_BY_SEEKER = gql`
query{
    deniedReviewsBySeeker{
        id
        isDenied
        createdAt
        updatedAt
        coach{
            id
            first_name
            last_name
            email
        }
        seeker{
            id
            first_name
            last_name
            email
        }
    }
}
`