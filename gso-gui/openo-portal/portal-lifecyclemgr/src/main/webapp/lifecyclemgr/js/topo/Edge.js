/* Copyright 2016, Huawei Technologies Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
var edgeColors = {
  red : "#f00",
  green: "#0f0",
  blue: "#00f",
  yellow: "#ff0",
  grey: "#555",
  black: "#000"
}

function Edge(id, label, source, target, size, color) {
  this.id = id;
  this.label = label;
  this.source = source;
  this.target = target;
  this.type = 'line';
  this.size = size;
  this.color = edgeColors[color];
}
