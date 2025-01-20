import {readFile} from "fs"
// TODO: Fix this case
import traverse, {NodePath} from "@babel/traverse"
import { readFileSync, access } from "fs"

const {writev} = require("fs")

traverse()