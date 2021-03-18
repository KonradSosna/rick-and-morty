import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import VueApollo from "@vue/apollo-option";
import gql from "graphql-tag";
import favoriteCharactersQuery from "./queries/favoriteCharacters.query.gql";
import characters from "./queries/characters.query.gql";

import Vue from "vue";

const httpLink = createHttpLink({
  uri: "https://rickandmortyapi.com/graphql",
});

const cache = new InMemoryCache();

const typeDefs = gql`
  input CharacterInput {
    id: ID!
    name: String
    image: String
    location: Location
  }

  extend type Query {
    favoriteCharacters: [Character]!
  }

  type Mutation {
    addToFavorites(character: CharacterInput!): [Character!]!
    removeFromFavorites(id: ID!): Boolean
  }
`;

const resolvers = {
  Query: {
    async charactersByName(root, { name }, { cache, client }) {
      const results = await client.query({ query: characters });

      const filtered = results.characters.results.filter(character => character.name.includes(name))
      results.characters.results = filtered
      console.log(results);
      return results;
    },
  },
  Mutation: {
    addToFavorites(_, { character }, { cache }) {
      const data = cache.readQuery({ query: favoriteCharactersQuery });
      data.favoriteCharacters.push(character);
      cache.writeQuery({ query: favoriteCharactersQuery, data });
    },
    removeFromFavorites(_, { id }, { cache }) {
      const data = cache.readQuery({ query: favoriteCharactersQuery });
      data.favoriteCharacters = data.favoriteCharacters.filter(
        (character) => character.id !== id
      );
      cache.writeQuery({ query: favoriteCharactersQuery, data });
    },
  },
};

cache.writeData({ data: { favoriteCharacters: [] } });

const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
  resolvers,
  typeDefs,
});

const vueApollo = new VueApollo({ defaultClient: apolloClient });

export const apolloClientProvider = apolloClient;
export const vueApolloProvider = vueApollo;
