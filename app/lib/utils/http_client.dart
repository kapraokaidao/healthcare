import 'dart:async';
import 'dart:core';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:mime_type/mime_type.dart';
import 'package:shared_preferences/shared_preferences.dart';

class HttpClient {
  // static final String baseUrl = 'http://localhost:3000'; // Local
  static final String baseUrl =
      'https://dev-healthcare-backend.kaoths.dev'; // Dev

  static Future<Map<String, String>> _getDefaultHeader() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String token = prefs.getString('accessToken');

    Map<String, String> headers = {};

    if (token != null) {
      headers['Authorization'] = 'Bearer ' + token;
    }

    return headers;
  }

  static Future<Map<String, dynamic>> get(
      {@required String path,
      Map<String, dynamic> queryParams = const {}}) async {
    Map<String, dynamic> headers = await _getDefaultHeader();

    String query = '?';
    queryParams.forEach((key, value) {
      query = query + key + "=" + value;
    });
    http.Response response =
        await http.get(baseUrl + path + query, headers: headers);
    return json.decode(response.body);
  }

  static Future<Map<String, dynamic>> post(
      String path, Map<String, dynamic> body) async {
    Map<String, dynamic> headers = await _getDefaultHeader();

    http.Response response =
        await http.post(baseUrl + path, body: body, headers: headers);

    return json.decode(response.body);
  }

  static Future<Map<String, dynamic>> postMultipartRequest(
      {@required String path,
      Map<String, dynamic> body = const {},
      List<String> files = const []}) async {
    Uri uri = Uri.parse(baseUrl + path);
    http.MultipartRequest request = http.MultipartRequest('POST', uri);

    Map<String, dynamic> headers = await _getDefaultHeader();
    headers.forEach((key, value) {
      request.headers[key] = value;
    });

    body.forEach((key, value) {
      if (value is List) {
        for (int i = 0; i < value.length; i++) {
          request.fields[key + '[' + i.toString() + ']'] = value[i];
        }
      } else if (value is int || value is double) {
        request.fields[key] = value.toString();
      } else {
        request.fields[key] = value;
      }
    });

    List<Future<http.MultipartFile>> filePromises = files
        .map((filePath) => http.MultipartFile.fromPath('files', filePath,
            contentType: MediaType.parse(mime(filePath))))
        .toList();
    List<http.MultipartFile> multipartFiles = await Future.wait(filePromises);
    multipartFiles.forEach((multipartFile) {
      request.files.add(multipartFile);
    });

    http.StreamedResponse streamedResponse = await request.send();
    http.Response response = await http.Response.fromStream(streamedResponse);
    return json.decode(response.body);
  }

  static Future<Map<String, dynamic>> put(
      String path, Map<String, dynamic> body) async {
    Map<String, dynamic> headers = await _getDefaultHeader();
    http.Response response =
        await http.put(baseUrl + path, body: body, headers: headers);
    return json.decode(response.body);
  }

  static Future<Map<String, dynamic>> patch(
      String path, Map<String, dynamic> body) async {
    http.Response response = await http.patch(baseUrl + path, body: body);
    return json.decode(response.body);
  }

  static Future<Map<String, dynamic>> delete(
      String path, Map<String, dynamic> body) async {
    http.Response response = await http.delete(baseUrl + path);
    return json.decode(response.body);
  }
}
